import axios from "axios";
import { useEffect, useState } from "react";
import {  useNavigate, useSearchParams } from "react-router-dom";
import keywordMap from "../../utils/keywordMap";
import '../../css/GroupBox.css' 
import '../../css/SearchBox.css' 

const SearchGroup = () => {

    const [gatherings, setGatherings] = useState([])
    const[searchParams]= useSearchParams();
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const keywordParam = searchParams.get('keyword') || '';
    
    useEffect(() => {

      setKeyword(keywordParam);

      if (!keywordParam.trim()) {
        setGatherings([]);
        return;
      }

      const mappedKeywords = keywordMap[keywordParam] || [keywordParam];

      const fetchData = async() =>{

      try{
          const res = await axios.get(`https://ardbyd7sf7.execute-api.ap-northeast-2.amazonaws.com/dev/moing/groups/search?keyword=${encodeURIComponent(mappedKeywords)}`);
          console.log('res.data.body:', res.data.body)
          setGatherings(JSON.parse(res.data.body));
        }
      catch(error){
          console.error('error: ', error);
          setGatherings([]);
      
      }
    }
      fetchData();
      }, [keywordParam]);

      const handleSearch = (e) =>{
        e.preventDefault();
        navigate(`/search?keyword=${encodeURIComponent(keyword)}`)
    }
      const handleClick = (gathering) => {
        navigate(`/moim/moimid?moimid=${encodeURIComponent(gathering.id)}&category=${encodeURIComponent(gathering.category)}`);
    };
    
return(
  <>
  
  <div className="search-container">
    <form onSubmit={handleSearch} className="search-form">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="모임을 검색하세요"
        className="search-input"
      />
      <button type="submit" className="search-button">
        검색
      </button>
    </form>

    <div className="search-results-container">
      <h2>“{keywordParam}” 검색 결과</h2>

      <div className="gathering-list">
        {gatherings.length > 0 ? (
          gatherings.map((gathering) => (
            <div key={gathering.id} className="gathering-box" onClick={() => handleClick(gathering)} style={{ cursor: 'pointer' }}>
              <img
                src={gathering.file_url}
                alt={`${gathering.name} 대표 이미지`}
                className="gathering-image"
              />
              <h5 className="gathering-name">모임 이름: {gathering.name}</h5>
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
  </div>
</>

    )
  };

export default SearchGroup;