import React from "react";

const IntroductionCard = ({moim}) => {
  return (
    <div className="bg-white rounded-2xl shadow p-6 min-h-[460px] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">모임 소개</h2>
          <button className="text-gray-400 hover:text-gray-600 text-xl">⋯</button>
        </div>
        <div className="text-sm text-gray-700 leading-relaxed mb-4">
          {moim.introduction_content}
        </div>
        <hr className="my-4 border-gray-200" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center"
            >
              📷
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroductionCard;