import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/userSlice";
import { removeUserFromCookies, removeCookie } from "../../utils/cookieUtils"; // 쿠키 유틸스 추가
import SearchGroup from "../Main/SearchGroup";

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


      <div className="w-4/5 bg-gray-500" >
        <ul className="flex p-4 text-white font-bold">
          <li className="pr-6 text-2xl">
            <Link to={'/'}>Moing</Link>
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
          </li>
          <li className="pr-6 text-2xl">
            <Link to={`/chat/1?memberId=4f38aabb-98b3-4a4d-a2ff-6ed7302df000`}>ChatMessage</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default BasicMenu;
