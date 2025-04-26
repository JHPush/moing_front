import React, { useEffect, useState } from "react";
import { getMoimImageByPresignedUrl, getPresignedURL_get } from "../../../../api/moimAPI";
import MoimEditModal from "./MoimEditModal";

const ProfileCard = ({ moim, user, moimRefresh }) => {
  const [moimProfile, setMoimProfile] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (moim.file_url) {
      getPresignedURL_get(moim.file_url, 'moim-profiles')
        .then((data) => {
          if (!data.body) return;
          const url = JSON.parse(data.body).download_url;
          setMoimProfile(url);
        })
        .catch((e) => {
          console.error('error : ', e);
        });
    }
  }, [moim.file_url]);

  return (
    <aside className="col-span-1 space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-sm text-center">
        <div className="w-24 h-24 mx-auto bg-gray-300 rounded-lg mb-4 overflow-hidden">
          {moimProfile ? (
            <img
              src={moimProfile}
              alt="Fetched Image"
              className="inset-0 h-full w-full object-cover object-bottom"
            />
          ) : (
            <p className="text-xs text-gray-400 pt-8">Loading image...</p>
          )}
        </div>
        <h2 className="font-bold text-lg">{moim.name} 모임</h2>
        <p className="text-sm font-bold text-gray-500">모임장 {moim.owner_nickname}</p>
        <p className="text-xs text-gray-400 mt-1">{moim.short_description}</p>
        <p className="text-sm text-gray-500 mt-2">멤버 {moim.member_count}</p>
        <p className="text-sm text-blue-600">{moim.id}</p>
        <div className="mt-2 text-left flex justify-between items-center">
          <span className="text-xs bg-gray-200 text-gray-600 rounded px-2 py-1">
            {moim.category}
          </span>
          {moim.owner_id === user.userId?
            <span
            className="flex text-sm items-center gap-1 text-gray-600 cursor-pointer hover:text-blue-600"
            onClick={() => setShowEditModal(true)}
          >
            ⚙️ 설정
          </span>:<></>}
        </div>
      </div>

      {showEditModal && (
        <MoimEditModal moim={moim} profile={moimProfile} moimRefresh={moimRefresh}  onClose={() => setShowEditModal(false)} />
      )}
    </aside>
  );
};

export default ProfileCard;
