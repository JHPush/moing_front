import React, { useState, useEffect } from "react";
import ChatMessage from "./ChatMessage";

const ChatMessageBox = ({ gatheringId, memberId, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ right: '16px', bottom: '16px' });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  
  // 드래그 시작 핸들러
  const handleMouseDown = (e) => {
    if (e.target.closest('.header-drag-area')) {
      setIsDragging(true);
      setStartPos({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  // 드래그 중 핸들러
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = startPos.x - e.clientX;
    const deltaY = startPos.y - e.clientY;
    
    // 화면 밖으로 나가지 않도록 제한
    const maxWidth = window.innerWidth - 320;
    const maxHeight = window.innerHeight - 480;
    
    const newRight = `${Math.max(16, Math.min(maxWidth, parseInt(position.right) + deltaX))}px`;
    const newBottom = `${Math.max(16, Math.min(maxHeight, parseInt(position.bottom) + deltaY))}px`;
    
    setPosition({
      right: newRight,
      bottom: newBottom
    });
    
    setStartPos({
      x: e.clientX,
      y: e.clientY
    });
  };

  // 드래그 종료 핸들러
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 마우스 이벤트 리스너 설정
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startPos]);

  return (
    <div 
      className="fixed max-w-xs bg-white rounded-lg shadow-xl flex flex-col z-50 overflow-hidden"
      style={{ 
        width: '320px', 
        height: '480px',
        right: position.right, 
        bottom: position.bottom,
        transition: isDragging ? 'none' : 'box-shadow 0.2s ease',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex justify-between items-center bg-blue-600 px-3 py-2 text-white header-drag-area cursor-move">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs mr-2">
            {gatheringId?.substring(0, 1).toUpperCase() || "M"}
          </div>
          <span className="font-medium text-sm truncate">
            {gatheringId?.replace('moing.us-', '') || '채팅'}
          </span>
        </div>
        <div className="flex items-center">
          <button 
            onClick={onClose} 
            className="text-white hover:text-blue-200 w-6 h-6 flex items-center justify-center rounded-full hover:bg-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatMessage gatheringId={gatheringId} memberId={memberId} />
      </div>
    </div>
  );
};

export default ChatMessageBox;