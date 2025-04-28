import { setUser } from '../store/userSlice';
import { saveUserToCookies } from './cookieUtils';
import { getUserData } from '../api/userAPI';


export const updateUserInfo = async(dispatch, userId, idToken, accessToken) => {

  const userData = await getUserData(userId, idToken);

  const userInfo = {
    userId: userData.userId,
    email: userData.email,
    nickname: userData.nickname,
    name: userData.name,
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

  dispatch(setUser(userInfo));
  saveUserToCookies(userInfo);
};
