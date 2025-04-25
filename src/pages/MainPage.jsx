import { useNavigate } from "react-router-dom";
import GroupView from "../components/Main/GroupView";
import BasicLayout from "../layouts/BasicLayout";
import { useState } from "react";

const MainPage = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) =>{
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

      <GroupView/>
    </BasicLayout> 
    
   );
}
 
export default MainPage;
