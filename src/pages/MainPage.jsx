import { useNavigate } from "react-router-dom";
import GroupView from "../components/Main/GroupView";
import BasicLayout from "../layouts/BasicLayout";
import { useEffect, useState } from "react";
import {updateUserInfo} from "../utils/updateUserInfo"
import { useDispatch, useSelector } from "react-redux";

const MainPage = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user)
  
  useEffect(()=>{
    if(user)
      updateUserInfo(dispatch,user.userId, user.idToken, user.accessToken)
  }, [])


  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?keyword=${encodeURIComponent(keyword)}`)
  }
  return (
    <BasicLayout>
      {/* <form onSubmit={handleSearch} className="search-form">
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="카테고리 또는 모임 이름 입력"
                className="search-input"
            />
            <button
                type="submit"
                className="search-button"
            >
                검색
            </button>
        </form> */}

      <GroupView />
    </BasicLayout>

  );
}

export default MainPage;
