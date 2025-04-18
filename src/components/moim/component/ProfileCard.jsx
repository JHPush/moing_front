import React from "react";

const ProfileCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col h-[320px]">
      <div className="w-full h-36 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
        <span className="text-3xl">📷</span>
      </div>
      <h2 className="text-lg font-semibold">사진을 사랑하는 모임</h2>
      <p className="text-sm text-gray-500">멤버 28</p>
      <p className="text-sm text-gray-500 mb-2">리더 박아무개</p>
      <p className="text-sm text-blue-600">moing.us/@sesamo</p>
      <div className="mt-2">
        <span className="text-xs bg-gray-200 text-gray-600 rounded px-2 py-1">문화/예술</span>
      </div>
    </div>
  );
};

export default ProfileCard;