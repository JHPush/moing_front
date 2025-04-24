import React, { useEffect, useState } from "react";
import { getNotify, changeIsRead } from "../../api/notifyAPI";
import { useSelector } from "react-redux";

const NotifyComponent = ({socket}) => {

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const user = useSelector((state) => state.user.user)
    const userId = user?.userId


    const toggleNotifications = async () => {
      const nextShowState = !showNotifications;
      setShowNotifications(nextShowState);
    
      // 알림창을 닫을 때 모든 알림을 읽음 처리
      if (nextShowState === false && notifications.length > 0) {
        notifications.forEach((n) => {
          const msg = n.message || n;
          if (!msg.is_read) {
            markAsRead(msg.id, msg.post_id); // 아직 읽지 않은 알림만 읽음 처리
          }
        });
      }
    };
  
    // 이전 알림 로드 
    useEffect(() => {
      if (!userId) return;
  
      const loadPreviousNotifications = async () => {
        try {
          const response = await getNotify(userId)
          console.log("response:", response)
          const data = JSON.parse(response.data.body)
          console.log("data: ", data)
          setNotifications(data.message);

        } catch (error) {
          console.error("알림 조회 실패:", error);
        }
      };

      loadPreviousNotifications();

    }, [userId]);
  

  
    // WebSocket 실시간알림 수신 처리
    useEffect(() => {
      if (!socket) return;
  
      const handleMessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("🔔 실시간 알림 수신:", data);
        setNotifications((prev) => [data, ...prev]); // 최신 알림이 위로 오게
      };
  
      socket.addEventListener("message", handleMessage);
      return () => {
        socket.removeEventListener("message", handleMessage);
      };
    }, [socket]);

    
    //읽음 처리
    const markAsRead = async (id, post_id) => {
      try {
        console.log("Marking as read with id:", id, "post_id:", post_id);
        const response = await changeIsRead(id, post_id)
        const data = response.data
        console.log("읽음 처리 결과:", data);

        setNotifications((prev) =>
          prev.map((n) => {
            const msg = n.message || n;
            if (msg.id === id && msg.post_id === post_id) {
              return { ...n, is_read: true }; // 읽음 처리
            }
            return n;
          })
        );
      } catch (err) {
        console.error("읽음 처리 실패:", err);
      }
    };
    
    //안읽은 메세지 숫자 표시
    // const unreadCount = notifications.filter((n) => {
    //   const msg = n.message || n;
    //   return !msg.is_read;
    // }).length;
    

  return (
    <div className="relative">
    <button
      onClick={toggleNotifications}
      className="relative px-3 py-2 rounded hover:bg-gray-100 text-black"
    >
      🔔
      {/* ✅ 읽지 않은 알림만 카운트 */}
      {notifications.filter(n => !(n.message || n).is_read).length > 0 && (
        <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
          {notifications.filter(n => !(n.message || n).is_read).length}
        </span>
      )}
    </button>

    {showNotifications && (
      <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded-lg z-50">
        <div className="p-4 font-bold text-gray-800 bg-blue-200 rounded-t-lg">알림</div>
        <ul className="max-h-96 overflow-y-auto bg-gray-50 rounded-b-lg">
          {notifications.length === 0 ? (
            <li className="p-4 text-gray-500">새로운 알림이 없습니다.</li>
          ) : (
            notifications.map((n, idx) => {
              const msg = n.message || n;
              let content = "";

              if (msg.post_type === "Notice") {
                content = `✉️ ${msg.gathering_id} 모임에 새로운 공지 "${msg.content}"이 등록되었습니다.`;
              } else if (msg.post_type === "Scheduled") {
                content = `📅 ${msg.gathering_id} 모임에 새로운 일정 "${msg.content}"이 등록되었습니다 (일정일: ${msg.schedule}).`;
              } else {
                content = `${msg.gathering_id} 모임에 "${msg.post_type} - ${msg.content}"이 등록되었습니다.`;
              }

              return (
                <li
                  key={idx}
                  className={`p-3 border-b text-sm hover:bg-gray-100 ${
                    msg.is_read ? "text-gray-400" : "font-semibold text-black"
                  }`}
                >
                  <div>{content}</div>
                  <div className="text-xs text-gray-500">🕒 {msg.reg_date}</div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    )}
  </div>
    

  );
}

export default NotifyComponent;
