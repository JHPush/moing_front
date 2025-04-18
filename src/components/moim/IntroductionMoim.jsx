import { CameraIcon, UsersIcon, CalendarDaysIcon, MapPinIcon } from "lucide-react";
import ProfileCard from "./component/ProfileCard";
import IntroductionCard from "./component/IntroductionCard";
import NoticeCard from "./component/NoticeCard";
import ActivityCard from "./component/ActivityCard";

const IntroductionMoim = () => {
    return (
        <div className="w-full min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
                {/* 프로필 카드와 그 아래 가입 버튼 */}
                <div className="col-span-3 flex flex-col gap-4">
                    <ProfileCard />
                    <button className="w-full bg-blue-500 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-600 shadow">
                        모임 가입하기
                    </button>
                </div>

                {/* 모임 소개 카드 */}
                <div className="col-span-6">
                    <IntroductionCard />
                </div>

                {/* 오른쪽 사이드바 - 모임 공지와 최근 활동 */}
                <div className="col-span-3 flex flex-col gap-4">
                    <NoticeCard />
                    <ActivityCard />
                </div>
            </div>
        </div>
    )
}

export default IntroductionMoim;