// src/utils/updateUserInfo.js
import { setUser } from '../store/userSlice';
import { saveUserToCookies } from './cookieUtils';
import { getUserData } from '../api/userAPI';


// 상태 갱신 및 쿠키 업데이트 함수
export const updateUserInfo = async(dispatch, userId, idToken, accessToken) => {

  const userData = await getUserData(userId, idToken); // 사용자 정보 API 호출

  console.log("userData : ", userData);

  const userInfo = {
    userId: userData.userId,
    email: userData.email,
    nickname: userData.nickname,
    name: userData.name,
    address: userData.address,
    profileImageUrl: userData.profileImageUrl,
    birth: userData.birth,
    gatherings: userData.gatherings,
    gender: userData.gender,
    role: userData.role,
    phoneNumber: userData.phoneNumber,
    isWithdraw: userData.isWithdraw,
    idToken: idToken,
    accessToken: accessToken,
  };

  dispatch(setUser(userInfo)); // 리덕스 상태 갱신
  saveUserToCookies(userInfo);  // 쿠키 갱신
};
