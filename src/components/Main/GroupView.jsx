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

    //사용자 근처 모임리스트, 내 위치 받아오기
    // const handleNearbyMeetupsUpdate = (groupList, dong) => {
    //     setNearbyMeetups(groupList);
    //     setDongName(dong);
    // };

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
        {/* <UserLocation onNearbyMeetupsUpdate={handleNearbyMeetupsUpdate} /> */}


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

            <UserLocation onNearbyMeetupsUpdate={(groupList, dong) => {
        setNearbyMeetups(groupList);
        setDongName(dong);
        }} />

            {/* ✅ 검색 중이면 검색 결과만 보여줌 */}
            {isSearching ? (
                <div className="search-results-container">
                    <h2>“{keyword}” 검색 결과</h2>
                    <button onClick={handleClickBack} className="back-button">돌아가기</button>
                    <div className="gathering-list">
                        {searchResult.length > 0 ? (
                            searchResult.map((gathering) => (
                                <div key={gathering.id} className="gathering-box" onClick={() => handleClick(gathering)} style={{ cursor: 'pointer' }}>
                                    <img src={gathering.file_url} alt={`${gathering.name} 대표 이미지`} className="gathering-image" />
                                    <h5>{gathering.name}</h5>
                                    <p>카테고리: {gathering.category}</p>
                                    <p>지역: {gathering.region}</p>
                                    <p>멤버 수: {gathering.member_count}</p>
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
                    <div className="text-center" style={{ marginTop: '10px' }}>
                    {dongName && (
                <button 
                    onClick={() => setShowAll(false)}
                    style={{
                        backgroundColor: !showAll ? '#add8e6' : '#f0f0f0',
                        padding: '6px 10px',
                        marginRight: '8px',
                        borderRadius: '5px',
                        fontSize: '14px',
                        border: '1px solid #ccc',
                        cursor: 'pointer',
                    }}
                >
                    "{dongName}" 근처 모임
                </button>
                    )}
                <button 
                    onClick={() => setShowAll(true)}
                    style={{
                        backgroundColor: showAll ? '#add8e6' : '#f0f0f0',
                        padding: '6px 10px',
                        borderRadius: '5px',
                        fontSize: '14px',
                        border: '1px solid #ccc',
                        cursor: 'pointer',
                    }}
                >
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
                        <h5>{gathering.name}</h5>
                        <p>카테고리: {gathering.category}</p>
                        <p>지역: {gathering.region}</p>
                        <p>멤버 수: {gathering.member_count}</p>
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
