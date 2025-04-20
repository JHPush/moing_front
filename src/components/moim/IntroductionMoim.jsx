import ProfileCard from "./component/ProfileCard";
import IntroductionCard from "./component/IntroductionCard";
import NoticeCard from "./component/NoticeCard";
import ActivityCard from "./component/ActivityCard";
import { useNavigate } from "react-router-dom";
import {  putJoinMoim } from "../../api/moimAPI";



const IntroductionMoim = ({moim, user}) => {
    const nav = useNavigate();

    const handleOnClickJoinMoim = (e)=>{
        if (user == null) {
            alert('로그인 정보 없음, 다시 로그인하세요')
            nav('/', { replace: true })
            return;
        }
        putJoinMoim(moim.id, moim.category, user.userId).then(data=>{
            console.log(data)
            alert('모입 가입 성공!')
            // 추후 모임 메인페이지로 진입필요
            // nav(`/introduct-moim/moimid?moimid=${moim.id}&category=${moim.category}`)
            nav('/', {replace:true})
        }).catch(e=>{
            console.log('error : ', e)
        })
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
                {/* 프로필 카드와 그 아래 가입 버튼 */}
                <div className="col-span-3 flex flex-col gap-4">
                    <ProfileCard moim={moim} user={user}/>
                    <button className="w-full bg-blue-500 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-600 shadow" onClick={handleOnClickJoinMoim} >
                        모임 가입하기
                    </button>
                </div>

                {/* 모임 소개 카드 */}
                <div className="col-span-6">
                    <IntroductionCard moim={moim}/>
                </div>

                {/* 오른쪽 사이드바 - 모임 공지와 최근 활동 */}
                <div className="col-span-3 flex flex-col gap-4">
                    <NoticeCard moim={moim}/>
                    <ActivityCard moim={moim}/>
                </div>
            </div>
        </div>
    )
}

export default IntroductionMoim;