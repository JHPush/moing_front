import { useEffect, useRef, useState } from "react"
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { loadInitialMessages  } from "../../api/chatAPI";
import { useWebSocket } from "../../contexts/WebSocketContext";

const ChatMessage = ({ gatheringId: propGatheringId, memberId: propMemberId }) =>{


    const {socket} = useWebSocket();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);

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
                setMessages(res.data.body || []);  
                console.log('res.data.body: ', res.data.body)
  
            } catch (error) {
                console.error('메시지 로드 실패:', error);
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
          setMessages((prev) => [...prev, response]);
        };
    
        socket.addEventListener("message", handleMessage);
    
        return () => {
          socket.removeEventListener("message", handleMessage);
        };
      }, [socket]);


        // const handleLoadMore = async () => {
        //   const lastRegDate = messages[0].reg_date;
        //   const olderMessages = await loadOlderMessages(gatheringId, lastRegDate);
        //   console.log("olderMessages:",olderMessages)
        //   setMessages((prev) => [...olderMessages, ...prev]);
        // };
        //     // 스크롤 이벤트로 스크롤이 맨 위에 도달했을 때 이전 메시지 로드
        // const handleScroll = () => {
        //   if (messagesContainerRef.current) {
        //       const container = messagesContainerRef.current;
        //       if (container.scrollTop === 0) {
        //           handleLoadMore();
        //       }
        //   }
        // };


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

        //메세지 로드시 스크롤 밑으로 내리는 기능
        useEffect(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
            }
        }, [messages]);

        // Enter 키 누르면 메세지 전송
        const handleKeyDown = (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 줄바꿈 방지
            if (messageInput.trim() !== '') {
              sendMessage(); // 메시지 전송
            }
          }
        };
        
          


        return(
            <>
              <div className="max-w-4xl mx-auto p-6 font-sans">
                <h1 className="text-center text-2xl font-bold mb-4">채팅</h1>
          
                <div className="border border-gray-300 rounded-lg p-4 h-[600px] overflow-y-auto bg-gray-100 mb-4"
                      // ref={messagesContainerRef} // 메시지 컨테이너에 ref 추가
                      // onScroll={handleScroll} // 스크롤 이벤트 추가
                      >
                  {messages.map((msg, index) => {
                      const isMine = msg.member_id == user.userId;
          
                      return (
                        <div
                          key={index}
                          className={`flex mb-3 ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                          {/* 💡 상대방 메시지일 경우 */}
                          {!isMine && (
                            <div className="flex flex-col items-start max-w-[70%]">
                              <span className="text-ml font-semibold text-gray-600 mb-1 ml-2">
                                {msg.nickname}
                              </span>
                              <div className="flex items-end">
                                <img
                                  src={msg.profileImageUrl}
                                  alt={msg.nickname}
                                  className="w-9 h-9 rounded-full mr-3"
                                />
                                <div className="flex-col">
                                  <div className="bg-gray-200 rounded-2xl px-4 py-2 text-sm text-left">
                                    {msg.content}
                                  </div>
                                  <span className="text-xs text-gray-500 mt-1 self-end">
                                    {new Date(msg.reg_date).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
          
                          {/* 💡 내 메시지일 경우 */}
                          {isMine && (
                            <div className="flex flex-col items-end max-w-[70%]">
                              <div className="bg-green-200 rounded-2xl px-4 py-2 text-sm text-left">
                                {msg.content}
                              </div>
                              <span className="text-xs text-gray-500 mt-1 self-end">
                                {new Date(msg.reg_date).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })
                }
                  <div ref={messagesEndRef} />
                </div>
          
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메시지를 입력하세요"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-base"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                  >
                    전송
                  </button>
                </div>
              </div>
            </>
      
);

}
export default ChatMessage;