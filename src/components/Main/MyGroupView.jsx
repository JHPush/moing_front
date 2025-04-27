import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getMyGroup } from "../../api/mainAPI";
import { useNavigate } from "react-router-dom";
import '../../css/GroupBox.css';

const MyGroupView = () => {
    const [gatherings, setGatherings] = useState([]);
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const res = await getMyGroup(user.userId);
                setGatherings(JSON.parse(res.data.body));
            } catch (error) {
                console.error("error: ", error);
            }
        };
        fetchData();
    }, [user]);

    const handleClick = (gathering) => {
        navigate(`/moim/moimid?moimid=${encodeURIComponent(gathering.id)}&category=${encodeURIComponent(gathering.category)}`);
    };

    const handleCreateGroup = () => {
        navigate("/create-moim");
    };

    return (
        <div className="my-groups-container">
            <h1 className="text-2xl font-bold text-left mb-8">내 모임</h1>

            <div className="gathering-list">
                {gatherings.length > 0 ? (
                    <>
                        {gatherings.map((gathering) => (
                            <div
                                key={gathering.id}
                                className="gathering-box cursor-pointer"
                                onClick={() => handleClick(gathering)}
                            >
                                <img
                                    src={gathering.file_url}
                                    alt={`${gathering.name} 이미지`}
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

                        {/* + 추가 카드 */}
                        <div
                            className="gathering-box flex flex-col justify-center items-center cursor-pointer"
                            onClick={handleCreateGroup}>
                            <div className="text-6xl text-gray-400 mb-2">+</div>
                            <div className="text-gray-500">모임 추가</div>
                        </div>
                    </>
                ) : (
                    <div
                        className="gathering-box flex flex-col justify-center items-center cursor-pointer"
                        onClick={handleCreateGroup}>
                        <div className="text-6xl text-gray-400 mb-2">+</div>
                        <div className="text-gray-500">모임 추가</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyGroupView;
