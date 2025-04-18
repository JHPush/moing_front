import { useEffect, useState } from "react";
import axios from "axios";
import MyGroupView from "./MyGroupView";
import SearchGroup from "./SearchGroup";
import { useNavigate } from "react-router-dom";
import '../../css/GroupBox.css' 
import '../../css/SearchBox.css' 

const GroupView = () => {
    const [gatherings, setGatherings] = useState([]);
    const [category, setCategory] = useState('');
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const getGroup = async () =>{
        // ?category=${category}
        const url = category
            ? `https://ardbyd7sf7.execute-api.ap-northeast-2.amazonaws.com/dev/moing/groups`
            : `https://ardbyd7sf7.execute-api.ap-northeast-2.amazonaws.com/dev/moing/groups`
        console.log('category: ', category)

        const res = await axios.get(url);

        console.log('res.data.body:', res.data.body)

        setGatherings(JSON.parse(res.data.body));

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
                <button onClick={() => setCategory('레저')} className="category-button">레저</button>
                <button onClick={() => setCategory('스포츠')} className="category-button">스포츠</button>
                <button onClick={() => setCategory('문화예술')} className="category-button">문화예술</button>
                <button onClick={() => setCategory('스터디')} className="category-button">스터디</button>
                <button onClick={() => setCategory('음식')} className="category-button">음식</button>
                <button onClick={() => setCategory('취미')} className="category-button">취미</button>
                <button onClick={() => setCategory('')} className="category-button">전체보기</button>
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
