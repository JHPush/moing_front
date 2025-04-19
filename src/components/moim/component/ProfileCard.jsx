import React, { useEffect, useState } from "react";
import { getMoimProfileImage, getPresignedURL_get } from "../../../api/moimAPI";

const ProfileCard = ({ moim }) => {
  const [moimProfile, setMoimProfile] = useState(null)

  useEffect(() => {
    if (!moimProfile) {
      getPresignedURL_get(moim.file_url).then(data => {
        const url = JSON.parse(data.body).download_url
        getMoimProfileImage(url).then(data => {
          setMoimProfile(URL.createObjectURL(data))
        }).catch(e => {
          console.log('error : ', e)
        })
      }).catch(e => {

      })
    }
  }, [moim])

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col h-[320px]">
      <div className="relative w-full h-48 bg-gray-300 overflow-hidden flex items-center justify-center">
        {moimProfile ? (
          <img
            src={moimProfile}
            alt="Fetched Image"
            className="absolute inset-0 h-full w-full object-cover object-bottom"
          />
        ) : (
          <p>Loading image...</p>
        )}
      </div>
      <h2 className="text-lg font-semibold">{moim.name} 모임</h2>
      <p className="text-sm text-gray-500">멤버 {moim.member_count}</p>
      <p className="text-sm text-gray-500 mb-2">모임장 {moim.owner_id}</p>
      <p className="text-sm text-blue-600">{moim.id}</p>
      <div className="mt-2">
        <span className="text-xs bg-gray-200 text-gray-600 rounded px-2 py-1">{moim.category}</span>
      </div>
    </div>
  );
};

export default ProfileCard;