import React, { useState } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { userPool } from '../../aws-config';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { saveUserToCookies } from '../../utils/cookieUtils'; // 쿠키 유틸스 추가
import axios from 'axios'; // API 호출을 위한 axios

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { email, password } = loginData;

    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });

    user.authenticateUser(authDetails, {
      onSuccess: async (result) => {
        const idToken = result.getIdToken().getJwtToken();
        const accessToken = result.getAccessToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();

        const payload = JSON.parse(atob(idToken.split('.')[1]));
        const userSub = payload.sub;

        // DynamoDB에서 사용자 정보 가져오기
        try {
          const response = await axios.get(`https://ardbyd7sf7.execute-api.ap-northeast-2.amazonaws.com/dev/login`, {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
            params: {
              userSub,
            },
          });

          const userData = response.data; // DynamoDB에서 가져온 사용자 정보

          // 사용자 정보 저장 (쿠키 및 Redux 상태)
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
            accessToken: accessToken
          };

          // 쿠키에 저장
          saveUserToCookies(userInfo);

          // Redux 상태에 저장
          dispatch(setUser(userInfo));

          alert('로그인 성공!');
          navigate('/');
        } catch (error) {
          alert('사용자 정보를 가져오는 데 실패했습니다.');
          console.error(error);
        }
      },
      onFailure: (err) => {
        alert('로그인 실패: ' + (err.message || JSON.stringify(err)));
      },
    });
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">로그인</h2>
      <div className="space-y-4">
        <input
          name="email"
          placeholder="이메일"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
