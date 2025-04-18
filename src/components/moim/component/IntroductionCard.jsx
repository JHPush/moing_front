import React from "react";

const IntroductionCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-6 min-h-[460px] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">모임 소개</h2>
          <button className="text-gray-400 hover:text-gray-600 text-xl">⋯</button>
        </div>
        <div className="text-sm text-gray-700 leading-relaxed mb-4">
          AI <span className="font-bold">&lt;Artificial Intelligence&gt;</span>로 급변하는 미래시대의 흐름과 문화 예술의 새로운 진화 과정 속에서 회원님들과 함께 체험하고 나누는 신선하고 아름다운 예술공간으로 발전해 나가기를 바랍니다.
          <br /><br />공지사항:<br />가. 예술모람 밴드는 2021년도 예술과 미술을 사랑하는 동호인 만남의 장소로 개설되어
          각기 3년여 이상의 사적 전공자 예술에 거창한 세계적 주류의 유학과 정보를 나누면서
          각자의 작품활동을 위한 학술자료를 위한 다양한 지식도 소개해 나가고 있습니다.
          <br />나.자유게시판에는 회원들의 작품 활동과 감동 전시회 공유로 회원님들의 문화생활에 도움이 되어드립니다.
          <br />다. 모임의 예쁨 단체 포스터 및 멤버님들의 의견적으로 언제나 환영합니다. 다만 포스팅 관련 모임의 개인적이고 사적인 사고절대적으로 금지하며
          엄바저적이며 철저히 단속하겠습니다.
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