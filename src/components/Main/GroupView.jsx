import { useEffect, useState } from "react";
import MyGroupView from "./MyGroupView";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllGroup } from "../../api/mainAPI";
import '../../css/GroupBox.css' 
import '../../css/SearchBox.css' 
import UserLocation from "./UserLocation";

const GroupView = () => {
    const [gatherings, setGatherings] = useState([]);
    const [category, setCategory] = useState('');
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);

    const getGroup = async () =>{

        const data = await getAllGroup(category);
        const groupList = JSON.parse(data);
        setGatherings(groupList);
      

    }

    useEffect(() => {
        getGroup();
    }, [category]);


    const handleClick = (gathering) => {
        navigate(`/moim/moimid?moimid=${encodeURIComponent(gathering.id)}&category=${encodeURIComponent(gathering.category)}`);
    };


    return (
        <>
        <UserLocation/>

        {/* 로그인한 경우에만 MyGroupView 표시 */}
        {user && <MyGroupView />}

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
                    <div key={gathering.id} className="gathering-box" onClick={() => handleClick(gathering)} style={{ cursor: 'pointer' }}>
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
