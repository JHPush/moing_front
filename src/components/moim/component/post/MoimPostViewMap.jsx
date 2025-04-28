import { useEffect, useRef } from "react";

const { kakao } = window;

// 게시글 상세보기 페이지에 들어가는 지도 
const MoimPostViewMap = ({ x, y, addr }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!kakao || !mapRef.current) return;

        const container = mapRef.current;
        const options = {
            center: new kakao.maps.LatLng(y, x),
            level: 3,
        };

        const map = new kakao.maps.Map(container, options);

        const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(y, x),
        });

        marker.setMap(map);
    }, [x, y]);

    return (
        <div>
            <div ref={mapRef} className="w-full h-64 rounded-md border" />
        </div>
    );
};

export default MoimPostViewMap;
