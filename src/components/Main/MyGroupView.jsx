import axios from "axios";
import { useEffect, useState } from "react";

const MyGroupView = ()=>{

    const [gatherings, setGatherings] = useState([]);
   

    const getMyGroup = async () =>{
        const res = await axios.get(`https://sey4ui2fw2.execute-api.ap-northeast-2.amazonaws.com/dev/gatherings/mine`);

        console.log('res.data.body:', res.data.body)

        setGatherings(JSON.parse(res.data.body));

    }

    useEffect(() => {
        getMyGroup();
    }, []);

    return(
    <div className="my-groups-container" style={{ padding: '20px' }}>
                <h1 className="text-center" style={{ marginBottom: '20px' }}>내 모임 목록</h1>
                <div className="group-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {gatherings.length > 0 ? (
                        gatherings.map((gathering) => (
                            <div
                                key={gathering.id}
                                style={{
                                    width: '23%',
                                    padding: '15px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: '#fff',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                }}
                            >
                                <img
                                    src={gathering.file_url}
                                    alt={`${gathering.name} 이미지`}
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                    }}
                                />
                                <h3 style={{ marginTop: '10px', fontSize: '1.2rem' }}>{gathering.name}</h3>
                                <p>카테고리: {gathering.category}</p>
                                <p>지역: {gathering.region}</p>
                                <p>회원 수: {gathering.member_count}</p>
                            </div>
                        ))
                    ) : (
                        <p>가입된 모임이 없습니다.</p>
                    )}
                </div>
            </div>
    )

}
export default MyGroupView;