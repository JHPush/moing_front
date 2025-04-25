import axios from "axios";
import { useEffect, useState } from "react";
import { getNearbyGroup } from "../../api/mainAPI";
import { LocateFixed } from "lucide-react";

const UserLocation = ({onNearbyMeetupsUpdate}) =>{

    const [userLocation, setUserLocation] = useState(null);
    const [userDong, setUserDong] = useState('');

    
    useEffect(() => {
        // 사용자의 GPS 위치를 가져옵니다
        const getUserLocation = () => {
            return new Promise((resolve, reject) => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                } else {
                    reject(new Error("Geolocation is not supported by this browser."));
                }
            });
        };

        // 카카오 API로 역지오코딩을 통해 주소추출
        const getAddressFromCoordinates = async (latitude, longitude) => {
            try {
                const response = await axios.get(`https://dapi.kakao.com/v2/local/geo/coord2address.json`, {
                    params: {
                        x: longitude,  // 경도
                        y: latitude,   // 위도
                    },
                    headers: {
                        Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`, // 환경변수로 API 키 설정
                    }
                });

                // 동 정보 추출
                const address = response.data.documents[0].address;
                return address.region_3depth_name;
                
            } catch (error) {
                console.error("주소 변환 실패:", error);
                return null;
            }
        };

        // 위치 받아오기
        getUserLocation()
            .then(async position => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude }); // 위도 경도 저장
                console.log(userLocation)

                const dong = await getAddressFromCoordinates(latitude, longitude);
                setUserDong(dong);
                if (!dong) return;

                const response = await getNearbyGroup(latitude, longitude);
                const groupList = JSON.parse(response.data.body);

                if (onNearbyMeetupsUpdate) {
                    onNearbyMeetupsUpdate(groupList, dong); 
                }
            })
            .catch(error => {
                console.error("위치 정보 오류:", error);
            });
        }, []);

    // 위치 정보가 설정된 후, 근처 모임 데이터를 가져오는 함수
    // const fetchNearbyMeetups = async () => {
    //     if (!userLocation) return;
    //     console.log(userLocation);
    //     const { latitude, longitude } = userLocation;

    //     try {
    //         const response = await getNearbyGroup(latitude, longitude)
    //         // const groupList = JSON.parse(response.data);
    //         // setNearbyMeetups(groupList); // 근처 모임 목록 저장
    //         // console.log("response",response);
    //         // console.log("groupList",groupList);
    //         // console.log("nearbymeetups:", nearbyMeetups)
    //         const groupList = JSON.parse(response.data.body); 
    //         console.log("grouplist:",groupList)
    //         if (onNearbyMeetupsUpdate) {
    //             onNearbyMeetupsUpdate(groupList, userDong);
    //         }           
    //     } catch (error) {
    //         console.error("모임 필터링 실패:", error);
    //     }
    // };

    // useEffect(() => {
    //     if (userLocation) {
    //         // 위치 정보가 설정되면 API 요청
    //         fetchNearbyMeetups();
    //     }
    // }, [userLocation]); // userLocation이 변경될 때마다 호출

    const updateLocation = (lat, lng) => {
        // 예: 서버에 위치 전송하거나 상태 업데이트
        setUserLocation({ lat, lng });
      
        // nearby 모임 다시 불러오기 등 추가 처리
        getNearbyGroup(lat, lng);
      };
      

    const handleUpdateLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log("현재 위치:", latitude, longitude);
              // 이 좌표를 백엔드나 상태에 전달하여 위치 기반 모임 업데이트
              updateLocation(latitude, longitude);
            },
            (error) => {
              console.error("위치 정보를 가져오는데 실패했습니다:", error);
              alert("위치 정보를 가져오는데 실패했습니다. 브라우저 권한을 확인해주세요.");
            }
          );
        } else {
          alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
        }
      };
      


    return(
        <> 
             <div>
             <button onClick={handleUpdateLocation} className="gps-button">
             <LocateFixed size={18} style={{ marginRight: '5px' }} /> 
             {userDong}
            </button>
        </div>
        </>
    )
}
export default UserLocation;