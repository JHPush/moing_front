import React from "react";

const NoticeCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 max-h-[250px]">
      <h2 className="text-lg font-semibold mb-2">모임 공지</h2>
      <div className="flex items-center gap-2 mb-1">
        <div className="bg-gray-200 text-sm px-2 py-1 rounded">5.10</div>
        <p className="text-sm text-gray-500">경남 양산시 동면 21-xxx, 103</p>
      </div>
      <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
        <strong>05.10 모임 공지</strong><br />5월 10일 토요일
        야생 촬영을 위한 모임을 계획하고 있습니다.
        지리산의 야생 반딧불을 직접 보며 자연을 촬영하려고 하는데, 관심 있으신 …
      </ul>
      <button className="mt-4 text-blue-500 hover:underline text-sm">Show more</button>
    </div>
  );
};

export default NoticeCard;