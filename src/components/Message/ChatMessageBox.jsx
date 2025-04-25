
import ChatMessage from "./ChatMessage";

const ChatMessageBox = ({ gatheringId, memberId, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 w-[350px] h-[700px] bg-white border border-gray-300 shadow-lg rounded-lg flex flex-col z-50">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-2 border-b">
        <span className="font-semibold text-sm">채팅</span>
        <button onClick={onClose} className="text-gray-500 hover:text-black">&times;</button>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatMessage gatheringId={gatheringId} memberId={memberId} />
      </div>
    </div>
  );
};

export default ChatMessageBox;