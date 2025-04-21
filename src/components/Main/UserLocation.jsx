import axios from "axios";
import { useEffect, useState } from "react";

const UserLocation = () =>{

    const [userLocation, setUserLocation] = useState(null);
    const [userDong, setUserDong] = useState(null);

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

                // 응답 결과에서 동 정보 추출
                const address = response.data.documents[0].address;
                console.log("address", address)
                const fullAddress = address.region_3depth_name; // "동" 정보가 여기에 있습니다.
                setUserDong(fullAddress); // 동 정보 저장
              
                return fullAddress;
                
            } catch (error) {
                console.error("주소 변환 실패:", error);
                return null;
            }
        };

        // 위치 받아오기
        getUserLocation()
            .then(position => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude }); // 위도 경도 저장
                getAddressFromCoordinates(latitude, longitude);
            })
            .catch(error => {
                console.error("위치 정보 오류:", error);
            });
        }, []);


    return(
        <>
             <div>
            {userLocation ? (
                <div>
                    <p>현재 위치: {userDong}</p>
                </div>
            ) : (
                <p>위치 정보를 가져오는 중...</p>
            )}
        </div>
        </>
    )
}
export default UserLocation;