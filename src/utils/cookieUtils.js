import Cookies from 'js-cookie';

export const setCookie = (name, value, days = 7) => {
  Cookies.set(name, value, {
    expires: days,
    path: '/',
    sameSite: 'Lax',
    secure: false
  });
};

export const getCookie = (name) => {
  return Cookies.get(name);
};

export const removeCookie = (name) => {
  Cookies.remove(name, { path: '/' });
};

export const saveUserToCookies = (user) => {
    setCookie('user', JSON.stringify(user), 7);
};

export const loadUserFromCookies = () => {
  const user = getCookie('user');
  return user ? JSON.parse(user) : null;
};

export const removeUserFromCookies = () => {
  removeCookie('user');
};
