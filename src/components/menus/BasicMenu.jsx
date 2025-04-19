import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/userSlice";
import { removeUserFromCookies, removeCookie, getCookie } from "../../utils/cookieUtils"; // 쿠키 유틸스 추가
import SearchGroup from "../Main/SearchGroup";

const BasicMenu = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const checkLogin = (e)=>{
    console.log(e.target.name)
    if(user) {
      nav(e.target.name)
      return;
    }
    alert('로그인을 진행해주세여')
    nav('', {replace:true})
  }

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
          <li className="pr-6 text-2xl">
          <button name="/create-moim" onClick={checkLogin}>모임 생성</button> 
          </li>
          <li className="pr-6 text-2xl">
          <button name="/introduct-moim/moimid?moimid=moing.us-파일생성%20테스트&category=영화" onClick={checkLogin}>임시 모임 조회</button> 
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default BasicMenu;
