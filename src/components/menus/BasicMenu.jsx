import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/userSlice";
import { removeUserFromCookies, removeCookie } from "../../utils/cookieUtils";
import { useWebSocket } from "../../contexts/WebSocketContext";
import NotifyComponent from "../Notify/NotifyComponent";
import LoginPage from "./LoginPage";
import ProfilePage from "../../pages/ProfilePage"

const BasicMenu = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { socket, disconnectWebSocket } = useWebSocket();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false); // ★ 로그인 모달 상태

  const handleLogout = () => {
    disconnectWebSocket();
    removeUserFromCookies();
    removeCookie('idToken');
    removeCookie('accessToken');
    removeCookie('refreshToken');
    localStorage.clear();
    dispatch(logoutUser());
    nav("/", { replace: true });
  };

  const openProfile = () => {
    setIsProfileOpen(true);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  const openLogin = () => {
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  const handleOnLogin = ()=>{
    console.log('im here')
    setIsLoginOpen(false)
  }

  return (
    <>
      <nav className="flex bg-gradient-to-r from-blue-400 to-indigo-500 justify-between items-center px-8 py-4 shadow-md">
        <div>
          <Link to="/" className="text-white text-3xl font-bold">Moing</Link>
        </div>

        <div className="flex items-center space-x-8">
          {isAuthenticated ? (
            <>
              <button onClick={openProfile} className="text-white hover:underline text-lg">
                {user?.email}
              </button>
              <button onClick={handleLogout} className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-all">
                로그아웃
              </button>
              <NotifyComponent socket={socket} />
            </>
          ) : (
            <>
              <button onClick={openLogin} className="text-white hover:underline text-lg">로그인</button>
              <Link to="/signup" className="text-white hover:underline text-lg">회원가입</Link>
            </>
          )}
        </div>
      </nav>

      {/* 프로필 모달 */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeProfile}
            >
              ✕
            </button>
            <ProfilePage />
          </div>
        </div>
      )}

      {/* 로그인 모달 */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeLogin}
            >
              ✕
            </button>
            <LoginPage handleOnLogin={handleOnLogin}/>
          </div>
        </div>
      )}
    </>
  );
};

export default BasicMenu;
