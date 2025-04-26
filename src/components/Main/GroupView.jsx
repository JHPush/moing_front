import { useEffect, useState } from "react";
import MyGroupView from "./MyGroupView";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllGroup, getSearchGroup } from "../../api/mainAPI";
import keywordMap from "../../utils/keywordMap";
import '../../css/GroupBox.css' 
import '../../css/SearchBox.css' 
import UserLocation from "./UserLocation";
import axios from "axios";

const GroupView = () => {
    const [gatherings, setGatherings] = useState([]);
    const [category, setCategory] = useState('');
    const [nearbyMeetups, setNearbyMeetups] = useState([]);
    const [dongName, setDongName] = useState(''); // 동 이름 저장
    const [showAll, setShowAll] = useState(false); //false: 위치기반, true: 전체보기
    const [keyword, setKeyword] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const joinedGatherings = user ? user.gatherings : [];
    
    //전체그룹 조회
    const getGroup = async () =>{
        const data = await getAllGroup(category);
        const groupList = JSON.parse(data);
        setGatherings(groupList);
    }

    useEffect(() => {
        getGroup();
    }, [category]);

    //모임 클릭시 상세페이지로 이동
    const handleClick = (gathering) => {
        navigate(`/moim/moimid?moimid=${encodeURIComponent(gathering.id)}&category=${encodeURIComponent(gathering.category)}`);
    };

    //검색상태 체크
    useEffect(() => {
        if (!isSearching) getGroup();
      }, [category, isSearching]);

    //전체보기 클릭시 검색상태 종료
    const handleShowAllClick = () => {
        setShowAll(true);
        setIsSearching(false); // 검색 종료 상태로
      };
    
    //검색함수
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!keyword.trim()) return;
        const mappedKeywords = keywordMap[keyword] || [keyword];
    
        try {
          const res = await getSearchGroup(mappedKeywords)
          setSearchResult(JSON.parse(res.data.body));
          setIsSearching(true);
        } catch (err) {
          console.error(err);
          setSearchResult([]);
        }
      };

    const handleClickBack = () =>{
        setIsSearching(false)
        setKeyword('')
    }


    return (
        <>
        {/* 로그인한 경우에만 MyGroupView 표시 */}
        {user && <MyGroupView />}

        {/*  검색창 추가 */}
            <div className="search-container">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="모임을 검색하세요"
                        className="search-input"
                    />
                    <button type="submit" className="search-button">검색</button>
                </form>
            </div>

            {/* ✅ 검색 중이면 검색 결과만 보여줌 */}
            {isSearching ? (
                <div className="search-results-container">
                    <h2>"{keyword}" 검색 결과</h2>
                    <button onClick={handleClickBack} className="back-button">돌아가기</button>
                    <div className="gathering-list">
                        {searchResult.length > 0 ? (
                            searchResult.map((gathering) => (
                                <div key={gathering.id} className="gathering-box" onClick={() => handleClick(gathering)} style={{ cursor: 'pointer' }}>
                                    <img src={gathering.file_url} alt={`${gathering.name} 대표 이미지`} className="gathering-image" />
                                    <div className="gathering-info">
                                        <h5 className="gathering-name">{gathering.name}</h5>
                                        <div className="gathering-detail">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                            <span>{gathering.category}</span>
                                        </div>
                                        <div className="gathering-detail">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            <span>{gathering.region}</span>
                                        </div>
                                        <div className="gathering-detail">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                            </svg>
                                            <span>{gathering.member_count}명</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>검색 결과가 없습니다.</p>
                        )}
                    </div>
                </div>
            ) : (
                <>        
                    {/* 위치기반 모임 / 전체 모임 */}
                    <div className="location-filter">
                    <UserLocation onNearbyMeetupsUpdate={(groupList, dong) => {
                        setNearbyMeetups(groupList);
                        setDongName(dong);
                    }} />
                    
                    {dongName && (
                <button 
                    onClick={() => setShowAll(false)}
                    className={`location-button ${!showAll ? 'active' : ''}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    "{dongName}" 근처 모임
                </button>
                    )}
                <button 
                    onClick={() => setShowAll(true)}
                    className={`location-button ${showAll ? 'active' : ''}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    전체 모임
                </button>
            </div>

        {/* 카테고리 필터 */}
        <div className="board-view">
            <div className="category-filters">
            {['레저', '스포츠', '문화예술', '스터디', '음식', '취미', ''].map((cate) => (
                <button
                key={cate || '전체보기'}
                onClick={() => setCategory(cate)}
                className={`category-button ${category === cate ? 'active' : ''}`}
                >
                {cate || '전체보기'}
                </button>
            ))}
            </div>
            {/* 모임리스트 */}
            <div className="gathering-list">
                {gatherings
                .filter((gathering) =>{
                    if (showAll) {
                        return true; // 전체 모임을 다 표시
                    }
                    return nearbyMeetups.some((nearby) => nearby.id === gathering.id) &&
                    (!user || !joinedGatherings.includes(gathering.id))})// 근처 모임만 표시
                .map((gathering) => (
                    <div key={gathering.id} className="gathering-box" onClick={() => handleClick(gathering)} style={{ cursor: 'pointer' }}>
                        <img
                            src={gathering.file_url}
                            alt={`${gathering.name} 대표 이미지`}
                            className="gathering-image"
                        />
                        <div className="gathering-info">
                            <h5 className="gathering-name">{gathering.name}</h5>
                            <div className="gathering-detail">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                                <span>{gathering.category}</span>
                            </div>
                            <div className="gathering-detail">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span>{gathering.region}</span>
                            </div>
                            <div className="gathering-detail">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                                <span>{gathering.member_count}명</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
            )}
    </>

    );
};

export default GroupView;
