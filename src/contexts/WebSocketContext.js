import React, { createContext, useState, useContext, useRef } from 'react';
import { useSelector } from 'react-redux';

// WebSocket 연결 상태를 관리할 context
const WebSocketContext = createContext();

// WebSocket 제공자 컴포넌트
export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const reconnectInterval = useRef(null);
  const pingInterval = useRef(null);
  console.log("socket:", socket)

  const user = useSelector(state => state.user.user)

  const connectWebSocket = (loginId) => {
    const url = `wss://pythgx0q47.execute-api.ap-northeast-2.amazonaws.com/production?userId=${loginId}`;
    const ws = new WebSocket(url);
    console.log(loginId)

    ws.onopen = () => {
      console.log('✅ WebSocket 연결 성공');
  
      setSocket(ws);

      // 주기적인 ping 메시지
      pingInterval.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          console.log('📡 WebSocket-Ping 메시지 전송 중...');
          ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, 5 * 60 * 1000); // 5분마다
    };

    ws.onclose = () => {
      console.log('❌ WebSocket 연결 종료');
      clearInterval(pingInterval.current);
      setSocket(null);

      console.log("재연결userId:" , user);

      //자동 재연결 시도
      if (user) {
        console.log("Redux 사용자",user)
        console.log("재연결 시도중", user.userId)
        reconnectInterval.current = setTimeout(() => {
          console.log('🔄 WebSocket 재연결 시도');
          connectWebSocket(user.userId);
        }, 3000); // 3초 후 재연결
      }
    };

    ws.onerror = (error) => {
      console.error(`WebSocket 에러:`, error);
    };

    return ws;
  };

  const connectOnLogin = (loginId) => {
    console.log(loginId)
    connectWebSocket(loginId);

  };
  


  // WebSocket 연결 종료
  const disconnectWebSocket = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    
    }
    clearInterval(pingInterval.current);
    clearTimeout(reconnectInterval.current);
    console.log('🛑로그아웃- WebSocket 연결 수동 종료 ');
  };

  return (
    <WebSocketContext.Provider value={{ socket, connectOnLogin, disconnectWebSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// WebSocketContext를 사용할 때 사용할 훅
export const useWebSocket = () => useContext(WebSocketContext);
