import axios from "axios";
import { useEffect, useState } from "react";
import '../../css/GroupBox.css' 

const MyGroupView = ()=>{

    const [gatherings, setGatherings] = useState([]);
   

    const getMyGroup = async () =>{
        const res = await axios.get(`https://ardbyd7sf7.execute-api.ap-northeast-2.amazonaws.com/dev/moing/groups/mine`);

        console.log('res.data.body:', res.data.body)

        setGatherings(JSON.parse(res.data.body));

    }

    useEffect(() => {
        getMyGroup();
    }, []);

    
    return(
        <div className="my-groups-container">
            <h1 className="text-center">내 모임 목록</h1>
            <div className="group-list">
                {gatherings.length > 0 ? (
                    gatherings.map((gathering) => (
                        <div key={gathering.id} className="gathering-box">
                            <img
                                src={gathering.file_url}
                                alt={`${gathering.name} 이미지`}
                                className="gathering-image"
                            />
                            <h3 className="gathering-name">{gathering.name}</h3>
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