import ProfileCard from "./component/moim/ProfileCard";
import IntroductionCard from "./component/moim/IntroductionCard";
import NoticeCard from "./component/moim/NoticeCard";
import ActivityCard from "./component/moim/ActivityCard";
import { useNavigate } from "react-router-dom";
import {  putJoinMoim } from "../../api/moimAPI";
import {updateUserInfo} from "../../utils/updateUserInfo"
import { useDispatch } from "react-redux";



const IntroductionMoim = ({moim, user}) => {
    const nav = useNavigate();
    const dispatch = useDispatch()

    const handleOnClickJoinMoim = (e)=>{
        console.log(user)
        if (user == null) {
            alert('로그인 정보 없음, 다시 로그인하세요')
            nav('/', { replace: true })
            return;
        }
        putJoinMoim(moim.id, moim.category, user.userId).then(data=>{
            // updateUserInfo(dispatch, user.userId)
            alert('모입 가입 성공!')
            // 추후 모임 메인페이지로 진입필요
            nav(`/introduct-moim/moimid?moimid=${moim.id}&category=${moim.category}`)
            // nav('/', {replace:true})
        }).catch(e=>{
            console.log('error : ', e)
        })
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
                <div className="col-span-3 flex flex-col gap-4">
                    <ProfileCard moim={moim} user={user}/>
                    <button className="w-full bg-blue-500 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-600 shadow" onClick={handleOnClickJoinMoim} >
                        모임 가입하기
                    </button>
                </div>

                <div className="col-span-6">
                    <IntroductionCard moim={moim}/>
                </div>

                <div className="col-span-3 flex flex-col gap-4">
                    <NoticeCard moim={moim}/>
                    <ActivityCard moim={moim}/>
                </div>
            </div>
        </div>
    )
}

export default IntroductionMoim;