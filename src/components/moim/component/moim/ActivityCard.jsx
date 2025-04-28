import React from "react";
import { CameraIcon, UsersIcon, CalendarDaysIcon } from "lucide-react";

const ActivityCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2">최근 활동</h2>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CameraIcon className="w-4 h-4 text-blue-500" />
          <p className="text-sm text-gray-700">지난 모임 사진 12장 업로드됨</p>
        </div>
        <div className="flex items-center gap-2">
          <UsersIcon className="w-4 h-4 text-blue-500" />
          <p className="text-sm text-gray-700">새 멤버 3명 가입</p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="w-4 h-4 text-blue-500" />
          <p className="text-sm text-gray-700">다음 모임: 05월 24일</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard
