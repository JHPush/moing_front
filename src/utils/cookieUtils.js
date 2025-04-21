// src/utils/cookieUtils.js
import Cookies from 'js-cookie';

export const setCookie = (name, value, days = 7) => {
  Cookies.set(name, value, {
    expires: days,
    path: '/',           // 모든 경로에서 접근 가능
    sameSite: 'Lax',     // 기본값 설정, cross-site 문제 방지
    secure: false        // 로컬 개발 환경에서는 false, 배포 시 true
  });
};

export const getCookie = (name) => {
  return Cookies.get(name);
};

export const removeCookie = (name) => {
  Cookies.remove(name, { path: '/' });
};

export const saveUserToCookies = (user) => {
    setCookie('user', JSON.stringify(user), 7); // 7일 동안 쿠키 유지
};

export const loadUserFromCookies = () => {
  const user = getCookie('user');
  return user ? JSON.parse(user) : null;
};

export const removeUserFromCookies = () => {
  removeCookie('user');
};
