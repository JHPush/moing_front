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
          !event.target.closest(".notify-button") &&
          showNotifications
        ) {
          // 외부 클릭이고 현재 알림창이 열려있는 경우, 모든 알림을 읽음 처리
          if (notifications.length > 0) {
            notifications.forEach((n) => {
              const msg = n.message || n;
              if (!msg.is_read) {
                markAsRead(msg.id, msg.post_id); // 아직 읽지 않은 알림만 읽음 처리
              }
            });
          }
          setShowNotifications(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showNotifications, notifications]);

    const toggleNotifications = async () => {
      const nextShowState = !showNotifications;
      setShowNotifications(nextShowState);
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
        const response = await changeIsRead(id, post_id);
        const data = response.data;
        console.log("읽음 처리 결과:", data);
        
        // 메시지 상태를 즉시 업데이트하고 필터링하여 unreadCount에 바로 반영되도록 함
        setNotifications((prev) => {
          const updated = prev.map((n) => {
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
          });
          
          // 읽음 처리 후 unreadCount 직접 업데이트
          const count = updated.filter((n) => !(n.message || n).is_read).length;
          setUnreadCount(count);
          
          return updated;
        });

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

    // 모임 ID에서 'moing.us-' 부분 제거하는 함수
    const formatMoimName = (moimId) => {
      return moimId?.replace('moing.us-', '') || moimId;
    };

    //알림클릭시 게시글로 이동
    const handleNotificationClick = (n) => {
      const msg = n.message || n; // 알림 데이터가 message를 가지고 있을 경우 그것을 사용
      const gathering_id = msg.gathering_id;  // gathering_id 추출
      const category = msg.category;   
      
      // 클릭한 알림만 읽음 처리
      markAsRead(msg.id, msg.post_id);
      
      // 알림창 닫기
      setShowNotifications(false);
      
      // 페이지 이동 전에 다른 모든 알림도 읽음 처리
      setTimeout(() => {
        notifications.forEach((notification) => {
          const notMsg = notification.message || notification;
          if (!notMsg.is_read && (notMsg.id !== msg.id || notMsg.post_id !== msg.post_id)) {
            markAsRead(notMsg.id, notMsg.post_id);
          }
        });
      }, 100);
      
      // APPROVE 타입인 경우 모임 페이지로 이동
      if (msg.notification_type === "APPROVE" || msg.notification_type === "APPLY") {
        navigate(`/moim/moimid?moimid=${gathering_id}&category=${category}`);
        return;
      }
      
      
      // 기존 게시글 이동 로직
      navigate(`/moim/moimid?moimid=${gathering_id}&category=${category}`, {
        state: {
          activeTab: 'postDetail',
          postId: msg.post_id
        }
      }); 
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
    
    // 날짜 포맷 함수
    const formatDate = (dateString) => {
      const now = new Date();
      const date = new Date(dateString);
      
      // 오늘인지 확인
      const isToday = date.getDate() === now.getDate() &&
                      date.getMonth() === now.getMonth() &&
                      date.getFullYear() === now.getFullYear();
      
      // 어제인지 확인
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = date.getDate() === yesterday.getDate() &&
                          date.getMonth() === yesterday.getMonth() &&
                          date.getFullYear() === yesterday.getFullYear();
      
      if (isToday) {
        return `오늘 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      } else if (isYesterday) {
        return `어제 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      } else {
        return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      }
    };

    // 알림 아이콘 함수
    const getNotificationIcon = (type, postType) => {
      if (type === "APPROVE") {
        return (
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      } else if (type === "APPLY") {
        return (
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        );
      } else if (postType === "Notice") {
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
            </svg>
          </div>
        );
      } else if (postType === "Scheduled") {
        return (
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
        );
      } else {
        return (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
          </div>
        );
      }
    };

  return (
    <div className="relative">
      <button
        onClick={toggleNotifications}
        className="notify-button relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none"
      >
        <div className="relative">
          🔔
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs bg-red-500 text-white rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </button>

      {showNotifications && (
        <div className="notify-popup absolute right-0 mt-2 w-80 bg-white shadow-xl border border-gray-200 rounded-lg z-50 overflow-hidden">
          <div className="flex justify-between items-center p-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-800 text-sm">알림</h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button 
                  className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={() => {
                    // 모든 알림 읽음 처리
                    notifications.forEach((n) => {
                      const msg = n.message || n;
                      if (!msg.is_read) {
                        markAsRead(msg.id, msg.post_id);
                      }
                    });
                  }}
                >
                  모두 읽음
                </button>
              )}
              <button 
                onClick={() => setShowNotifications(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="max-h-[350px] overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-xs">새로운 알림이 없습니다</p>
              </div>
            ) : (
              notifications.map((n, idx) => {
                const msg = n.message || n;
                const formattedMoimName = formatMoimName(msg.gathering_id);
                let title = "";
                let details = "";

                // 알림 타입에 따라 다른 내용 표시
                if (msg.notification_type === "APPROVE") {
                  title = `${formattedMoimName} 모임 가입 승인`;
                  details = "모임 가입이 승인되었습니다.";
                } 
                  else if (msg.notification_type === "APPLY") {
                  title = `${formattedMoimName} 모임 가입 신청`;
                  details = "모임 가입 신청 요청이 있습니다.";
                } 
                  else if (msg.post_type === "Notice") {
                  title = `${formattedMoimName} 모임 새 공지`;
                  details = msg.content;
                } else if (msg.post_type === "Scheduled") {
                  title = `${formattedMoimName} 모임 새 일정`;
                  details = `${msg.content} (일정일: ${msg.schedule})`;
                } else {
                  title = `${formattedMoimName} 모임 새 글`;
                  details = `${msg.post_type || ''} - ${msg.content}`;
                }

                return (
                  <div
                    key={`${msg.id}-${msg.post_id}`}
                    className={`flex p-3 hover:bg-gray-50 cursor-pointer ${
                      msg.is_read ? "bg-white" : "bg-blue-50"
                    }`}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                      {msg.notification_type === "APPROVE" && (
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                        {msg.notification_type === "APPLY" && (
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      {msg.post_type === "Notice" && (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      {msg.post_type === "Scheduled" && (
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      {!msg.notification_type && msg.post_type !== "Notice" && msg.post_type !== "Scheduled" && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className={`text-xs truncate ${
                          msg.is_read ? "text-gray-800" : "font-medium text-gray-900"
                        }`}>
                          {title}
                        </p>
                        <div className="flex items-center ml-2">
                          <span className="text-[10px] text-gray-500">
                            {formatDate(msg.reg_date)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(msg.gathering_id, userId, msg.post_id);
                            }}
                            className="ml-1 text-gray-400 hover:text-red-500 p-0.5 rounded-full hover:bg-gray-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className={`text-[10px] truncate mt-0.5 ${
                        msg.is_read ? "text-gray-500" : "text-gray-600"
                      }`}>
                        {details}
                      </p>
                      {!msg.is_read && (
                        <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-0.5"></span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotifyComponent;
