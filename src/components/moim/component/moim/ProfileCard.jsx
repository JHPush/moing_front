import React, { useEffect, useState } from "react";
import { getMoimImageByPresignedUrl, getPresignedURL_get } from "../../../../api/moimAPI";

const ProfileCard = ({ moim, user }) => {
  const [moimProfile, setMoimProfile] = useState('')

  useEffect(() => {
    if (!moimProfile || moimProfile ==='') {
      getPresignedURL_get(moim.file_url, 'moim-profiles').then(data => {
        if(!data.body) return
        const url = JSON.parse(data.body).download_url
          setMoimProfile(url)
      }).catch(e => {
        console.error('error : ', e)
      })
    }
  }, [moim])

  return (
    <aside className="col-span-1 space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-sm text-center">
        <div className="w-24 h-24 mx-auto bg-gray-300 rounded-lg mb-4">
          {moimProfile!=='' ? (
            <img
              src={moimProfile}
              alt="Fetched Image"
              className="inset-0 h-full w-full object-cover object-bottom"
            />
          ) : (
            <p>Loading image...</p>
          )}

        </div>
        <h2 className="font-bold text-lg">{moim.name} 모임</h2>
        <p className="text-sm font-bold  text-gray-500">모임장 {user.nickname}</p>
        <p className="text-xs text-gray-400 mt-1">사진을 좋아하는 사람들끼리 모이는 곳</p>
        <p className="text-sm text-gray-500 mt-2">멤버 {moim.member_count}</p>
        <p className="text-sm text-blue-600">{moim.id}</p>
        <div className="mt-2 text-left">
          <span className="text-xs bg-gray-200 text-gray-600 rounded px-2 py-1">{moim.category}</span>
        </div>
      </div>
    </aside>

  );
};

export default ProfileCard;