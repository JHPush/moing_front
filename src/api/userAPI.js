import axios from 'axios';

const PREFIX_URL = process.env.REACT_APP_PREFIX_URL

export const getUserData = async (userSub, idToken) => {
  try {
    const response = await axios.get(
      `${PREFIX_URL}/login`,
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
    const response = await axios.get(`${PREFIX_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user info", error);
    return null;
  }
};