// src/components/menus/LoginPage.jsx
import React, { useState } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { userPool } from '../../aws-config';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUserData } from '../../api/userAPI';  // 사용자 정보 가져오기 API 호출
import { updateUserInfo } from '../../utils/updateUserInfo';  // 상태 업데이트 함수

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
          const userData = await getUserData(userSub, idToken); // 사용자 정보 API 호출

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
            accessToken: accessToken,
          };

          // 상태와 쿠키를 업데이트하는 함수 호출
          updateUserInfo(dispatch, userInfo);

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
