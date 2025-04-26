import { useEffect, useRef, useState } from "react"
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { loadInitialMessages, loadPreviousMessages } from "../../api/chatAPI";
import { useWebSocket } from "../../contexts/WebSocketContext";

const ChatMessage = ({ gatheringId: propGatheringId, memberId: propMemberId }) =>{


    const {socket} = useWebSocket();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [hasMoreMessages, setHasMoreMessages] = useState(true); // 더 불러올 메시지가 있는지 여부
    const [isAtTop, setIsAtTop] = useState(false); // 스크롤이 맨 위에 있는지 여부
    const [triedLoadingMore, setTriedLoadingMore] = useState(false); // 이전 메시지 로드 시도 여부

    const user = useSelector(state => state.user.user)
    const params = useParams();
    const gatheringId = propGatheringId ?? params.gatheringId;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const memberId = propMemberId || queryParams.get('memberId');

    useEffect(()=>{
        // 기존 메시지 로드
        const fetchMessages = async () => {
            try {
                const res = await loadInitialMessages(gatheringId);
                
                // 응답 데이터 구조 확인 후 메시지 설정
                if (res.data && res.data.body) {
                    const parsedBody = typeof res.data.body === 'string' 
                        ? JSON.parse(res.data.body) 
                        : res.data.body;
                    
                    // 새로운 API 응답 구조 처리
                    if (parsedBody.success && Array.isArray(parsedBody.messages)) {
                        // 원본 데이터 그대로 사용 (정렬 제거)
                        setMessages(parsedBody.messages);
                        setHasMoreMessages(parsedBody.hasMore || false);
                    } else if (Array.isArray(parsedBody)) {
                        // 배열인 경우
                        setMessages(parsedBody);
                    } else if (parsedBody.message && Array.isArray(parsedBody.message)) {
                        // message 필드가 배열인 경우
                        setMessages(parsedBody.message);
                    } else {
                        // 기본은 빈 배열
                        setMessages([]);
                    }
                } else {
                    // 응답이 없거나 형식이 다른 경우 빈 배열로 초기화
                    setMessages([]);
                }
                
                console.log('초기 메시지 응답:', res.data);
            } catch (error) {
                console.error('메시지 로드 실패:', error);
                setMessages([]); // 에러 발생 시 빈 배열로 설정
            }
        };

        fetchMessages(); // 초기 메시지 가져오기
    }, [gatheringId]);


    // WebSocket register 메시지 보내기
    useEffect(() => {
      if (!socket) return;

      const handleRegister = () => {
        const registerMessage = {
          action: "chat",
          gathering_id: gatheringId,
          member_id: user.userId,
          message: "register",
        };
        socket.send(JSON.stringify(registerMessage));
        console.log("register 메시지 전송됨:", registerMessage);
      };

      if (socket.readyState === WebSocket.OPEN) {
        handleRegister();
      } else {
        socket.addEventListener("open", handleRegister);
      }

      return () => {
        socket.removeEventListener("open", handleRegister);
      };
    }, [socket, gatheringId, user.userId]);

    // 메시지 수신 처리
      useEffect(() => {
        if (!socket) return;
        console.log("socket:", socket)
        const handleMessage = (event) => {
          console.log("event:", event)
          const response = JSON.parse(event.data);
          console.log("받은 데이터:", response);
          console.log(response.type)
          if(response.type !== 'chat') {
            return;
          }
          
          // 중복 메시지 확인
          const messageId = `${response.gathering_id}-${response.member_id}-${response.reg_date}`;
          const isDuplicate = messages.some(msg => 
            `${msg.gathering_id}-${msg.member_id}-${msg.reg_date}` === messageId
          );
          
          if (!isDuplicate) {
            // 새로운 메시지를 받으면 기존 메시지에 그대로 추가 (정렬 제거)
            setMessages((prev) => [...prev, response]);
          }
        };
    
        socket.addEventListener("message", handleMessage);
    
        return () => {
          socket.removeEventListener("message", handleMessage);
        };
      }, [socket, messages]);


      // 이전 메시지 불러오기 함수 (실제 API 사용)
      const loadOlderMessages = async (gatheringId, lastRegDate) => {
        try {
            const response = await loadPreviousMessages(gatheringId, lastRegDate);
            
            // 응답 데이터 구조 확인 후 메시지 추출
            if (response.data && response.data.body) {
                const parsedBody = typeof response.data.body === 'string' 
                    ? JSON.parse(response.data.body) 
                    : response.data.body;
                
                // 새로운 API 응답 구조 처리
                if (parsedBody.success) {
                    // hasMore 상태 업데이트
                    setHasMoreMessages(parsedBody.hasMore || false);
                    
                    // 메시지 반환 (원본 그대로)
                    if (Array.isArray(parsedBody.messages)) {
                        return parsedBody.messages;
                    }
                    return [];
                }
                
                // 이전 구조 처리
                if (Array.isArray(parsedBody)) {
                    return parsedBody;
                } else if (parsedBody.message && Array.isArray(parsedBody.message)) {
                    return parsedBody.message;
                }
            }
            return [];
        } catch (error) {
            console.error('이전 메시지 로드 실패:', error);
            return [];
        }
    };

    // 메세지 로드시 스크롤 밑으로 내리는 기능
    useEffect(() => {
        // 새 메시지 수신 시만 스크롤을 아래로 내림 (초기 로드 또는 새 메시지 수신 시)
        // 이전 메시지 로드 시에는 스크롤을 유지해야 함
        if (messagesEndRef.current && !window.isLoadingOlderMessages) {
            messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
        }
    }, [messages]);

    // 스크롤 맨 위에서 이전 메시지 로드
    const handleLoadMore = async () => {
        if (messages.length === 0 || !hasMoreMessages) return;
        
        // 이전 메시지 로드 중임을 표시
        window.isLoadingOlderMessages = true;
        setTriedLoadingMore(true); // 이전 메시지 로드 시도 표시
        
        try {
            // 현재 메시지 중 가장 오래된 메시지의 등록일시 가져오기
            const oldestMessage = messages.length > 0 ? messages[0] : null;
            if (!oldestMessage) {
                window.isLoadingOlderMessages = false;
                return;
            }
            
            const oldestRegDate = oldestMessage.reg_date;
            console.log("가장 오래된 메시지 날짜:", oldestRegDate);
            
            // 이전 메시지 불러오기
            const olderMessages = await loadOlderMessages(gatheringId, oldestRegDate);
            
            if (olderMessages && olderMessages.length > 0) {
                // 중복 메시지 제거 - 이미 표시된 메시지 ID를 가진 메시지는 제외
                const existingMessageIds = new Set(messages.map(msg => 
                    `${msg.gathering_id}-${msg.member_id}-${msg.reg_date}`
                ));
                
                const uniqueNewMessages = olderMessages.filter(msg => 
                    !existingMessageIds.has(`${msg.gathering_id}-${msg.member_id}-${msg.reg_date}`)
                );
                
                if (uniqueNewMessages.length === 0) {
                    console.log("새로운 메시지가 없습니다.");
                    setHasMoreMessages(false);
                    window.isLoadingOlderMessages = false;
                    return;
                }
                
                // 현재 스크롤 위치 저장
                const scrollContainer = messagesContainerRef.current;
                const firstVisibleElement = scrollContainer.children[1]; // 첫 번째 실제 메시지 요소
                const initialOffset = firstVisibleElement ? firstVisibleElement.offsetTop : 0;
                
                // 새 메시지 추가 (앞에 추가)
                setMessages(prev => [...uniqueNewMessages, ...prev]);
                
                // 새 메시지가 추가된 후 실행될 useEffect
                setTimeout(() => {
                    // 새로 추가된 메시지 이후의 요소 위치로 스크롤 복원
                    if (firstVisibleElement && scrollContainer) {
                        const newPosition = (firstVisibleElement.offsetTop + 50);
                        scrollContainer.scrollTop = newPosition;
                    }
                    window.isLoadingOlderMessages = false;
                }, 100);
                
                console.log(`${uniqueNewMessages.length}개의 이전 메시지 로드됨`);
            } else {
                console.log("더 이상 불러올 메시지가 없습니다.");
                setHasMoreMessages(false);
                window.isLoadingOlderMessages = false;
            }
        } catch (error) {
            console.error("이전 메시지 로드 중 오류 발생:", error);
            window.isLoadingOlderMessages = false;
        }
    };
    
    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
        if (messagesContainerRef.current) {
            const { scrollTop } = messagesContainerRef.current;
            // 스크롤이 맨 위에 있는지 확인
            setIsAtTop(scrollTop <= 10);
            
            // 스크롤이 맨 위에 도달하면 이전 메시지 로드
            if (scrollTop <= 10 && hasMoreMessages && !window.isLoadingOlderMessages) {
                handleLoadMore();
            }
        }
    };


    // 메시지 전송
    const sendMessage = () => {
        if (messageInput.trim() && socket && socket.readyState === WebSocket.OPEN) {
            const message = {
                action: "chat",
                gathering_id: gatheringId, 
                member_id: user.userId,
                message: messageInput,
            };
            // WebSocket을 통해 메시지 전송
            socket.send(JSON.stringify(message));
            console.log('보낸 메시지:', message);
            setMessageInput('');
        }
    }

    // Enter 키 누르면 메세지 전송
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 줄바꿈 방지
            if (messageInput.trim() !== '') {
                sendMessage(); // 메시지 전송
            }
        }
    };
    
    const formatMessageDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        
        // 날짜가 오늘인지 확인
        const isToday = date.getDate() === now.getDate() && 
                        date.getMonth() === now.getMonth() &&
                        date.getFullYear() === now.getFullYear();
        
        if (isToday) {
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
        } else {
            return date.toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
            }) + ' ' + date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
        }
    };

    // 메시지 날짜 비교를 위한 헬퍼 함수
    const isSameDay = (date1, date2) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    };

    // 날짜 포맷팅 헬퍼 함수
    const formatDateHeader = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            weekday: 'short'
        });
    };

    return(
        <div className="flex justify-center items-center w-full bg-gray-100">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[80vh] my-4">
                {/* 채팅방 헤더 */}
                <div className="bg-blue-600 text-white p-3 flex items-center shadow-md">
                    <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-lg">
                        {gatheringId?.substring(0, 1).toUpperCase() || "M"}
                    </div>
                    <div className="ml-3">
                        <h1 className="text-lg font-semibold">{gatheringId?.replace('moing.us-', '') || '채팅방'}</h1>
                        <p className="text-xxs text-blue-100">{messages.length > 0 ? `${messages.length}개의 메시지` : '메시지가 없습니다'}</p>
                    </div>
                </div>
                
                {/* 메시지 목록 */}
                <div 
                    className="flex-1 overflow-y-auto p-3 bg-gray-50"
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                >
                    <div className="sticky top-0 z-10 text-center py-1">
                        {/* 이전 메시지를 로드 시도한 후 더 이상 메시지가 없을 때만 표시 */}
                        {isAtTop && !hasMoreMessages && triedLoadingMore && (
                            <div className="inline-block bg-gray-200 text-gray-600 text-xxs px-2 py-0.5 rounded-full">
                                더 이상 메시지가 없습니다
                            </div>
                        )}
                        {hasMoreMessages && window.isLoadingOlderMessages && (
                            <div className="inline-block bg-gray-200 text-gray-600 text-xxs px-2 py-0.5 rounded-full">
                                메시지 불러오는 중...
                            </div>
                        )}
                    </div>
                    
                    {/* 메시지를 날짜별로 그룹화하여 표시 */}
                    {Array.isArray(messages) && messages.length > 0 && (() => {
                        let currentDate = null;
                        return messages.map((msg, index) => {
                            const isMine = msg.member_id == user.userId;
                            const prevMsg = index > 0 ? messages[index - 1] : null;
                            const showSender = !isMine && (!prevMsg || prevMsg.member_id !== msg.member_id || !isSameDay(prevMsg.reg_date, msg.reg_date));
                            
                            // 날짜가 바뀌었는지 확인
                            const msgDate = new Date(msg.reg_date);
                            const showDateHeader = !currentDate || !isSameDay(currentDate, msgDate);
                            
                            // 현재 날짜 업데이트
                            if (showDateHeader) {
                                currentDate = msgDate;
                            }
                            
                            return (
                                <div key={`${msg.reg_date}-${index}`}>
                                    {/* 날짜 구분선 */}
                                    {showDateHeader && (
                                        <div className="flex justify-center my-2">
                                            <div className="bg-gray-200 text-gray-600 text-xxs px-2 py-0.5 rounded-full">
                                                {formatDateHeader(msg.reg_date)}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className={`flex mb-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
                                        {/* 상대방 메시지 */}
                                        {!isMine && (
                                            <div className="flex flex-col max-w-[70%]">
                                                {showSender && (
                                                    <span className="text-xs font-semibold text-gray-800 mb-0.5 ml-1">
                                                        {msg.nickname || '알 수 없음'}
                                                    </span>
                                                )}
                                                <div className="flex items-end">
                                                    {showSender && (
                                                        <img
                                                            src={msg.profileImageUrl || 'https://via.placeholder.com/50'}
                                                            alt={msg.nickname}
                                                            className="w-6 h-6 rounded-full mr-1"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://via.placeholder.com/50';
                                                            }}
                                                        />
                                                    )}
                                                    <div className="flex-col">
                                                        <div className="bg-white rounded-lg px-3 py-1.5 text-xs text-left shadow-sm border border-gray-200">
                                                            {msg.content || msg.message}
                                                        </div>
                                                        <span className="text-[10px] text-gray-400 mt-0.5 ml-1">
                                                            {formatMessageDate(msg.reg_date)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
            
                                        {/* 내 메시지 */}
                                        {isMine && (
                                            <div className="flex flex-col items-end max-w-[70%]">
                                                <div className="bg-blue-500 text-white rounded-lg px-3 py-1.5 text-xs shadow-sm">
                                                    {msg.content || msg.message}
                                                </div>
                                                <span className="text-[10px] text-gray-400 mt-0.5 mr-1">
                                                    {formatMessageDate(msg.reg_date)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        });
                    })()}
                    <div ref={messagesEndRef} />
                </div>
                
                {/* 메시지 입력 */}
                <div className="bg-white p-2 border-t">
                    <div className="flex items-center bg-gray-100 rounded-full overflow-hidden px-3 py-0.5">
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="메시지를 입력하세요"
                            className="flex-1 bg-transparent outline-none py-1.5 px-1 text-sm"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!messageInput.trim()}
                            className={`p-1.5 rounded-full transition-colors ${
                                messageInput.trim() 
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatMessage;