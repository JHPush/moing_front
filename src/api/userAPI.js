// src/api/userAPI.js
import axios from 'axios';

export const getUserData = async (userSub, idToken) => {
  try {
    const response = await axios.get(
      `https://ardbyd7sf7.execute-api.ap-northeast-2.amazonaws.com/dev/login`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        params: {
          userSub,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('사용자 정보를 가져오는 데 실패했습니다.');
  }
};

// userId로 유저 정보 가져오기
export const getUserById = async (userId) => {
    try {
      const response = await axios.get(`https://ardbyd7sf7.execute-api.ap-northeast-2.amazonaws.com/dev/users/${userId}`);
      console.log("response : ". response);
      return response.data; // 사용자 정보 반환
    } catch (error) {
      console.error("Failed to fetch user info", error);
      return null;
    }
  };