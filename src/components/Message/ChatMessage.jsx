import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom";

const ChatMessage = () =>{

    const {gatheringId} = useParams();
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const ws = useRef(null);
    const messagesEndRef = useRef(null);

    const memberId= '1234'
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
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, [messages]);


    return (
    <>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center' }}>채팅</h1>

            <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', height: '400px', overflowY: 'auto', backgroundColor: '#f9f9f9', marginBottom: '16px' }}>
                {messages.map((msg, index) => {
                    const isMine = msg.member_id == memberId;

                    return (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                justifyContent: isMine ? 'flex-end' : 'flex-start',
                                marginBottom: '10px',
                            }}
                        >
                            {/* 프로필 이미지 */}
                            {!isMine && (
                                <img
                                src={msg.file_path}
                                alt={msg.nickname}
                                style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
                                />
                            )}
                            <div
                                style={{
                                    background: isMine ? '#DCF8C6' : '#E6E6E6',
                                    borderRadius: '16px',
                                    padding: '10px 14px',
                                    maxWidth: '70%',
                                }}
                            >
                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                    {isMine ? '나' : `${msg.nickname}`}
                                </div>
                                <div>{msg.content}</div>
                                <div style={{ fontSize: '0.75rem', color: 'gray', marginTop: '4px', textAlign: 'right' }}>
                                    {new Date(msg.reg_date).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} /> 
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="메시지를 입력하세요"
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '1rem',
                    }}
                />
                <button
                    onClick={sendMessage}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    전송
                </button>
            </div>
        </div>
    </>
);

}
export default ChatMessage;