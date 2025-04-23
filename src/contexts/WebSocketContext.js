import React, { createContext, useState, useContext, useEffect } from 'react';

// WebSocket 연결 상태를 관리할 context
const WebSocketContext = createContext();

// WebSocket 제공자 컴포넌트
export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  // WebSocket 연결 함수
  const connectWebSocket = (url) => {
    const socket = new WebSocket(url);
    // console.log("type:", type)
    socket.onopen = () => {
      console.log(`WebSocket 연결 성공`);
    };

    socket.onclose = () => {
      console.log(`WebSocket 연결 종료`);
    };

    socket.onerror = (error) => {
      console.error(`WebSocket 에러:`, error);
    };

    return socket;
  };

  const connectOnLogin = (userId) => {
    const Url = `wss://pythgx0q47.execute-api.ap-northeast-2.amazonaws.com/production?userId=${userId}`;
    const socket = connectWebSocket(Url);
  
    setSocket(socket);

  };
  


  // WebSocket 연결 종료
  const disconnectWebSocket = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, connectOnLogin, disconnectWebSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// WebSocketContext를 사용할 때 사용할 훅
export const useWebSocket = () => useContext(WebSocketContext);
