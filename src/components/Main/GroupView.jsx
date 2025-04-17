import { useEffect, useState } from "react";
import axios from "axios";
import MyGroupView from "./MyGroupView";

const GroupView = () => {
    const [gatherings, setGatherings] = useState([]);
    const [category, setCategory] = useState('');

    const getGroup = async () =>{

        const url = category
            ? `https://sey4ui2fw2.execute-api.ap-northeast-2.amazonaws.com/dev/gatherings?category=${category}`
            : `https://sey4ui2fw2.execute-api.ap-northeast-2.amazonaws.com/dev/gatherings`
        console.log('category: ', category)

        const res = await axios.get(url);

        console.log('res.data.body:', res.data.body)

        setGatherings(JSON.parse(res.data.body));

    }

    useEffect(() => {
        getGroup();
    }, [category]);

    return (
    <>
    <MyGroupView />

    <div className="board-view">
        <h1 className="my-5 text-center">모든 모임 목록</h1>
        <div className="category-filters">
                <button onClick={() => setCategory('sport')}>스포츠</button>
                <button onClick={() => setCategory('culture')}>문화</button>
                <button onClick={() => setCategory('community')}>친목</button>
                <button onClick={() => setCategory('food')}>음식</button>
                <button onClick={() => setCategory('study')}>학습</button>
                <button onClick={() => setCategory('hobby')}>취미</button>
                <button onClick={() => setCategory('')}>전체보기</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {gatherings.map((gathering) => (
                <div 
                    key={gathering.id} 
                    style={{
                        width: '23%', 
                        marginBottom: '20px', 
                        padding: '15px', 
                        border: '1px solid #ddd', 
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#fff',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                >
                    <img 
                        src={gathering.file_url} 
                        alt={`${gathering.name} 대표 이미지`} 
                        style={{
                            width: '100%', 
                            height: '200px', 
                            objectFit: 'cover', 
                            borderRadius: '8px'
                        }} 
                    />
                    <h5 style={{ marginTop: '10px' }}>모임 이름: {gathering.name}</h5>
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
