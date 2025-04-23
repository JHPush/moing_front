import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getMyGroup } from "../../api/mainAPI";
import '../../css/GroupBox.css' 
import { useNavigate } from "react-router-dom";

const MyGroupView = ()=>{

    const [gatherings, setGatherings] = useState([]);
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user)

    useEffect(() => {
        const fetchData = async () =>{

            if(!user) return;
            try{
                const res = await getMyGroup(user.userId)
                setGatherings(JSON.parse(res.data.body));
            } catch (error) {
                console.error("error: ", error);
                
            }
        }
            fetchData();
        
    }, [user]);

    const handleClick = (gathering) => {
        navigate(`/moim/moimid?moimid=${encodeURIComponent(gathering.id)}&category=${encodeURIComponent(gathering.category)}`);
    };

    
    return(
        <div className="my-groups-container">
            <h1 className="text-center">내 모임 목록</h1>
            <div className="group-list">
                {gatherings.length > 0 ? (
                    gatherings.map((gathering) => (
                        <div key={gathering.id} className="gathering-box" onClick={() => handleClick(gathering)} style={{ cursor: 'pointer' }}>
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