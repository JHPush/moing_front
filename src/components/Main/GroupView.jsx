import { useEffect, useState } from "react";
import axios from "axios";
import MyGroupView from "./MyGroupView";
import { useNavigate } from "react-router-dom";
import { getAllGroup } from "../../api/mainAPI";
import { getPresignedURL_get } from "../../api/moimAPI";
import '../../css/GroupBox.css' 
import '../../css/SearchBox.css' 
import UserLocation from "./UserLocation";

const GroupView = () => {
    const [gatherings, setGatherings] = useState([]);
    const [category, setCategory] = useState('');
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const getGroup = async () =>{

        const data = await getAllGroup(category);
        const groupList = JSON.parse(data);
        console.log("category: ", category)
        setGatherings(groupList);
        console.log("groupList:", groupList)
      

    }

    useEffect(() => {
        getGroup();
    }, [category]);

    const handleSearch = (e) =>{
        e.preventDefault();
        navigate(`/search?keyword=${encodeURIComponent(keyword)}`)
    }

    return (
        <>
        <UserLocation/>
        <form onSubmit={handleSearch} className="search-form">
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
        </form>
        <MyGroupView />

        <div className="board-view">
            <h1 className="text-center">모든 모임 목록</h1>
            <div className="category-filters">
            {['레저', '스포츠', '문화예술', '스터디', '음식', '취미', ''].map((cate) => (
                <button
                key={cate || '전체보기'}
                onClick={() => setCategory(cate)}
                className="category-button"
                style={{
                  backgroundColor: category === cate ? '#add8e6' : '#f0f0f0', // 선택된 버튼은 연한 파랑, 나머지는 회색
                  color: 'black', // 글자 색은 항상 검정
                  border: '1px solid #ccc',
                  padding: '8px 12px',
                  marginRight: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                >
                {cate || '전체보기'}
                </button>
            ))}
            </div>
            <div className="gathering-list">
                {gatherings.map((gathering) => (
                    <div key={gathering.id} className="gathering-box">
                        <img
                            src={gathering.file_url}
                            alt={`${gathering.name} 대표 이미지`}
                            className="gathering-image"
                        />
                        <h5>{gathering.name}</h5>
                        <p>카테고리: {gathering.category}</p>
                        <p>지역: {gathering.region}</p>
                        <p>멤버 수: {gathering.member_count}</p>
                    </div>
                ))}
            </div>
        </div>
    </>

    );
};

export default GroupView;
