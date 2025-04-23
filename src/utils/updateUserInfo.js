// src/utils/updateUserInfo.js
import { setUser } from '../store/userSlice';
import { saveUserToCookies } from './cookieUtils';

// 상태 갱신 및 쿠키 업데이트 함수
export const updateUserInfo = (dispatch, user) => {
  dispatch(setUser(user)); // 리덕스 상태 갱신
  saveUserToCookies(user);  // 쿠키 갱신
};
