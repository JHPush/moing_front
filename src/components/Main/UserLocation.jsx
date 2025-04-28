import axios from "axios";
import { useEffect, useState } from "react";
import { getNearbyGroup } from "../../api/mainAPI";
import { LocateFixed } from "lucide-react";

const UserLocation = ({ onNearbyMeetupsUpdate }) => {

  const [userLocation, setUserLocation] = useState(null);
  const [userDong, setUserDong] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 사용자의 GPS 위치를 가져옵니다
    const getUserLocation = () => {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
          reject(new Error("이 브라우저는 위치 정보를 지원하지 않습니다."));
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

    const fetchLocation = async () => {
      setLoading(true);
      try {
        const position = await getUserLocation();
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        const dong = await getAddressFromCoordinates(latitude, longitude);
        setUserDong(dong);

        // 위치 기반 모임 업데이트
        const response = await getNearbyGroup(latitude, longitude);
        const groupList = JSON.parse(response.data.body);
        onNearbyMeetupsUpdate?.(groupList, dong);

      } catch (error) {
        console.error("위치 정보 오류:", error);
        setUserLocation(null);
        setUserDong('');

      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const handleUpdateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("현재 위치:", latitude, longitude);
          // 이 좌표를 백엔드나 상태에 전달하여 위치 기반 모임 업데이트
          setUserLocation({ latitude, longitude });
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

  return (
    <>
      {loading ? (
        <div className="gps-status">
          <div className="gps-loading-spinner"></div>
          <span>위치 정보 가져오는 중...</span>
        </div>
      ) : userDong ? (
        <button onClick={handleUpdateLocation} className="gps-button">
          <LocateFixed size={18} />내 위치
        </button>
      ) : (
        <button className="gps-button gps-error" onClick={handleUpdateLocation}>
          <LocateFixed size={18} />위치 정보 없음
        </button>
      )}
    </>
  )
}
export default UserLocation;