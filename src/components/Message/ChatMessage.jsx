import { useEffect, useRef, useState } from "react"
import { useLocation, useParams } from "react-router-dom";

const ChatMessage = () =>{

    const {gatheringId} = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const memberId = queryParams.get('memberId');
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const ws = useRef(null);
    const messagesEndRef = useRef(null);

    console.log('memberId: ', memberId)
    useEffect(()=>{
        // 기존 메시지 로드
        const fetchMessages = async () => {
            try {
                const response = await fetch(`https://0yar9o6gfh.execute-api.ap-northeast-2.amazonaws.com/dev/chat/${gatheringId}`);
                const data = await response.json();
                console.log('data: ', data)
                setMessages(data.body || []);  
                console.log('data.body: ', data.body)
            } catch (error) {
                console.error('메시지 로드 실패:', error);
            }
        };

        fetchMessages(); // 초기 메시지 가져오기

        ws.current = new WebSocket(`wss://3iynbl7z39.execute-api.ap-northeast-2.amazonaws.com/production/?gathering_id=${gatheringId}&member_id=${memberId}`)
    
        ws.current.onopen = () => {
            console.log('WebSocket connected')
        }
        ws.current.onmessage = (event) => {
            const response = JSON.parse(event.data);
            console.log('받은 데이터: ', response);

            setMessages((prevMessages) => [...prevMessages, response]);
        };
            
        ws.current.onerror = (error) => {
            console.log('WebSocket Error:', error);
        };
    
        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        setSocket(ws.current);

        return () =>{
            if(ws.current){
                ws.current.close();
            }
        }
        },[gatheringId, memberId])


        const sendMessage = () => {
            if (messageInput.trim()) {
            const message = {
                gathering_id: gatheringId, 
                member_id: memberId,
                message: messageInput,
            };
            // WebSocket을 통해 메시지 전송
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(message));
                console.log('보낸 메시지:', message);
            }
            setMessageInput('');
            }
        }


        useEffect(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
            }
        }, [messages]);

          


    return (
        <>
        <div className="max-w-4xl mx-auto p-6 font-sans">
          <h1 className="text-center text-2xl font-bold mb-4">채팅</h1>
      
          <div className="border border-gray-300 rounded-lg p-4 h-[600px] overflow-y-auto bg-gray-100 mb-4">
            {messages.map((msg, index) => {
              const isMine = msg.member_id == memberId;
      
              return (
            <div
            key={index}
            className={`flex mb-3 ${isMine ? 'justify-end' : 'justify-start'}`}
            >
            {/* 💡 상대방 메시지일 경우 */}
            {!isMine && (
                <div className="flex flex-col items-start max-w-[70%]">
                {/* ✅ 닉네임을 말풍선 위에 표시 */}
                <span className="text-ml font-semibold text-gray-600 mb-1 ml-2">{msg.nickname}</span>

                <div className="flex items-end">
                    {/* ✅ 프로필 이미지 (변경 없음) */}
                    <img
                    src={msg.file_path}
                    alt={msg.nickname}
                    className="w-9 h-9 rounded-full mr-3"
                    />

                    {/* ✅ 말풍선과 시간 컨테이너 분리 */}
                    <div className=" flex-col">
                    {/* ✅ 메시지 내용 왼쪽 정렬, padding 조정 */}
                    <div className="bg-gray-200 rounded-2xl px-4 py-2 text-sm text-left">
                        {msg.content}
                    </div>

                    {/* ✅ 시간: 말풍선 바깥, 아래, 오른쪽 정렬 */}
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
                {/* ✅ 내 메시지 말풍선: 왼쪽 정렬 + 패딩 조정 */}
                <div className="bg-green-200 rounded-2xl px-4 py-2 text-sm text-left">
                    {msg.content}
                </div>

                {/* ✅ 시간: 말풍선 바깥, 아래, 오른쪽 정렬 */}
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
            })}
            <div ref={messagesEndRef} />
          </div>
      
          <div className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
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