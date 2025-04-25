import React, { useEffect, useState } from "react";
import { getNotify, changeIsRead, deleteNotify } from "../../api/notifyAPI";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NotifyComponent = ({socket}) => {

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);  // unreadCount를 상태로 추가
    const user = useSelector((state) => state.user.user)
    const userId = user?.userId
    const navigate = useNavigate();

      // 알림 외부 클릭 시 팝업 닫기
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          !event.target.closest(".notify-popup") &&
          !event.target.closest(".notify-button")
        ) {
          setShowNotifications(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    // 알림 최신순으로 정렬 
    const sortByDateDesc = (notis) =>
    [...notis].sort((a, b) => {
      const dateA = new Date((a.message || a).reg_date);
      const dateB = new Date((b.message || b).reg_date);
      return dateB - dateA;
    });
  
    // 이전 알림 로드 
    useEffect(() => {
      if (!userId) return;
  
      const loadPreviousNotifications = async () => {
        try {
          const response = await getNotify(userId)
          console.log("response:", response)
          const data = JSON.parse(response.data.body)
          console.log("data:", data)

          setNotifications(sortByDateDesc(data.message));

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
        // console.log(data.type)
        if(data.type !== 'notify') {
          return;
        }
        console.log("🔔 실시간 알림 수신:", data);
        setNotifications((prev) =>
          sortByDateDesc([data, ...prev]) 
        );
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
            if (msg.id === id && msg.post_id === post_id && !msg.is_read) {
              // 💡 message 내부까지 is_read 갱신
              return {
                ...n,
                message: { ...msg, is_read: true },
                is_read: true,
              };
            }
            return n;
          })
        );

      } catch (err) {
        console.error("읽음 처리 실패:", err);
      }
    };
    
    //안읽은 메세지 숫자 표시
    useEffect (()=>{
      
      const count = notifications.filter(
        (n) => !(n.message || n).is_read
      ).length;
      setUnreadCount(count);
 
    },[notifications])


    //알림클릭시 게시글로 이동
    const handleNotificationClick = (n) => {
      const msg = n.message || n; // 알림 데이터가 message를 가지고 있을 경우 그것을 사용
      const gathering_id = msg.gathering_id;  // gathering_id 추출
      const category = msg.category;   
      markAsRead(msg.id, msg.post_id) 
      console.log("markasread",markAsRead)
      navigate(`/moim/moimid?moimid=${gathering_id}&category=${category}`, {
        state: {
          activeTab: 'postDetail',
          postId: msg.post_id
         
        }
  
      }); 
      
      console.log(msg.post_id);
    };

    //알림 삭제 
    const handleDeleteNotification = async (gathering_id, userId, post_id) => {
      try {
        const res= await deleteNotify(gathering_id, userId, post_id);
        console.log(gathering_id, userId, post_id)
        setNotifications((prev) =>
          prev.filter((n) => {
            const msg = n.message || n;
            return !(msg.gathering_id === gathering_id && msg.post_id === post_id);
          })
        );
        console.log("res:", res)
        if(res.data.statusCode = 200){
          console.log("알림 삭제 완료")
        }
      } catch (err) {
        console.error("알림 삭제 실패:", err);
      }
    };
    

    

  return (
    <div className="relative">
      <button
        onClick={toggleNotifications}
        className="notify-button relative px-3 py-2 rounded hover:bg-gray-100 text-black"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="notify-popup absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded-lg z-50">
          <div className="p-4 font-bold text-gray-800 bg-blue-200 rounded-t-lg">
            알림
          </div>
          <ul className="max-h-96 overflow-y-auto bg-gray-50 rounded-b-lg">
            {notifications.length === 0 ? (
              <li className="p-4 text-gray-500">새로운 알림이 없습니다.</li>
            ) : (
              notifications
              .map((n, idx) => {
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
                  key={msg.id || idx}
                  onClick={() => handleNotificationClick(n)}
                  className={`relative p-3 border-b text-sm hover:bg-gray-100 ${
                    msg.is_read ? "text-gray-400" : "font-semibold text-black"
                  }`}
                >
                  <div>{content}</div>
                
                  <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                    <div>🕒 {msg.reg_date}</div>
                    <div className="ml-auto flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(msg.gathering_id, userId, msg.post_id);
                        }}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full p-1 transition duration-150"
                      >
                        ✖️
                      </button>
                    </div>
                  </div>
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
