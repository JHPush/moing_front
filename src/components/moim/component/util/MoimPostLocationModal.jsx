import { useEffect, useRef, useState } from "react";
import { getUserLocation } from "../../../../api/moimAPI";

const { kakao } = window;

const MoimLocationModal = ({ onClose, onSelect }) => {
  const mapRef = useRef(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [coord, setCoord] = useState({x:'', y:''})

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=566487bf7bb12b958b4fb8e4c1ac8058&libraries=services`;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);
  }, []);

//   useEffect(()=>{
// console.log(coord)
//   }, [coord])
  
  useEffect(() => {
    if (!isLoaded) return;

    const mapContainer = mapRef.current;

    const map = new kakao.maps.Map(mapContainer, {
      center: new kakao.maps.LatLng(37.5665, 126.9780),
      level: 3,
    });
    const geocoder = new kakao.maps.services.Geocoder();
    const ps = new kakao.maps.services.Places();

    const marker = new kakao.maps.Marker();

    // 지도 클릭
    kakao.maps.event.addListener(map, "click", function (mouseEvent) {
      const latlng = mouseEvent.latLng;
      geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const address = result[0].address.address_name;
          setSelectedAddress(address);
          setCoord({x: String(latlng.getLng()), y : String(latlng.getLat())})
          marker.setPosition(latlng);
          marker.setMap(map);
        }
      });
    });
    

    // 검색 버튼 이벤트
    const searchBtn = document.getElementById("searchBtn");
    const searchPlaces = () => {
      if (!searchKeyword.trim()) return;
      ps.keywordSearch(searchKeyword, function (data, status) {
        if (status === kakao.maps.services.Status.OK) {
          const place = data[0];
          const loc = new kakao.maps.LatLng(place.y, place.x);
          map.setCenter(loc);
          marker.setPosition(loc);
          marker.setMap(map);
          setSelectedAddress(place.address_name);
        }
      });
    };
    // 현재 위치로 설정
    const xy = getUserLocation().then(pos => {
      const loc = new kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      map.setCenter(loc);
      marker.setPosition(loc);
      marker.setMap(map);

    }).catch(e => {
      console.error('위치 받아오기 실패', e)
    })
    searchBtn.addEventListener("click", searchPlaces);

    return () => {
      searchBtn.removeEventListener("click", searchPlaces);
    };
  }, [isLoaded, searchKeyword]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 space-y-4">
        <div className="flex gap-2">
          <input
            className="flex-1 border px-2 py-1 rounded"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="장소 또는 주소 검색"
          />
          <button id="searchBtn" className="bg-blue-500 text-white px-4 py-1 rounded">
            검색
          </button>
        </div>

        <div ref={mapRef} style={{ width: "100%", height: "400px" }} />

        {selectedAddress && (
          <p className="text-green-600 text-sm mt-2">선택된 주소: {selectedAddress}</p>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="border px-4 py-2 rounded hover:bg-gray-50">
            닫기
          </button>
          <button
            onClick={() => {
              if (!selectedAddress) {
                alert("주소를 선택하세요");
                return;
              }
              onSelect({selectedAddress, coord});
              onClose();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoimLocationModal;
