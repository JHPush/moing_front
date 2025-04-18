import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/userSlice";
import { removeUserFromCookies, removeCookie } from "../../utils/cookieUtils"; // 쿠키 유틸스 추가

const BasicMenu = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    removeUserFromCookies();
    removeCookie('idToken');
    removeCookie('accessToken');
    removeCookie('refreshToken');
    localStorage.clear();
    dispatch(logoutUser());
  };

  return (
    <nav id='navbar' className="flex bg-blue-300 justify-between items-center px-6 py-4">
      <div>
        <Link to="/" className="text-white text-2xl font-bold">Main</Link>
      </div>

      <div className="space-x-4 text-white">
        {isAuthenticated ? (
          <>
            <span>{user?.email}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default BasicMenu;
