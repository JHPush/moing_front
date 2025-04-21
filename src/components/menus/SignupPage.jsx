import React, { useState } from 'react';
import { userPool } from '../../aws-config';
import { postUserToLambda } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: 기본 입력, 2: 추가 정보, 3: 이메일 인증
  const [userSub, setUserSub] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [cognitoUser, setCognitoUser] = useState(null);
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    name: '',
    nickname: '',
    gender: '',
    birth: '',
    phoneNumber: '',
    address: '',
  });

  const [emailSent, setEmailSent] = useState(false); // 이메일 인증 코드가 전송됐는지 체크

  const handleChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // 1단계: 이메일/비밀번호로 Cognito에 임시 가입
  const handleInitialSignup = () => {
    const { email, password } = signupData;
    userPool.signUp(email, password, [{ Name: 'email', Value: email }], null, (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }

      setUserSub(result.userSub);
      setCognitoUser(result.user); // confirmRegistration 시 필요
      setEmailSent(true); // 이메일 전송됨 표시
      setStep(2);
    });
  };

  // 2단계: 추가 정보 입력 후 Lambda로 전송
  const handleAdditionalSubmit = async () => {
    const payload = { userId: userSub, ...signupData };
    try {
      const res = await postUserToLambda(payload);
      if (res.ok) {
        alert('추가 정보 저장 완료! 이메일 인증 코드를 입력해주세요.');
        setStep(3);
      } else {
        alert('Lambda 저장 실패');
      }
    } catch (err) {
      console.error('Lambda 호출 실패:', err);
      alert('서버 오류');
    }
  };

  // 3단계: 이메일 인증 코드 확인
  const handleConfirmCode = () => {
    cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
      if (err) {
        alert('인증 코드 오류: ' + (err.message || JSON.stringify(err)));
        setConfirmationCode(''); // 인증 코드 초기화 후 다시 입력할 수 있도록
        return;
      }
      alert('회원가입 완료! 로그인 페이지로 이동합니다.');
      navigate('/login');
    });
  };

  // 이메일 인증 코드 재전송
  const handleResendCode = () => {
    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        alert('재전송 실패: ' + (err.message || JSON.stringify(err)));
        return;
      }
      alert('이메일 인증 코드가 재전송되었습니다.');
    });
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">회원가입</h2>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <input name="email" placeholder="이메일" onChange={handleChange} className="border p-2 w-full" />
          <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} className="border p-2 w-full" />
          <button onClick={handleInitialSignup} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
            다음
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <input name="name" placeholder="이름" onChange={handleChange} className="border p-2 w-full" />
          <input name="nickname" placeholder="닉네임" onChange={handleChange} className="border p-2 w-full" />
          <input name="gender" placeholder="성별 (MALE/FEMALE)" onChange={handleChange} className="border p-2 w-full" />
          <input name="birth" placeholder="생년월일 (YYYY-MM-DD)" onChange={handleChange} className="border p-2 w-full" />
          <input name="phoneNumber" placeholder="전화번호" onChange={handleChange} className="border p-2 w-full" />
          <input name="address" placeholder="주소" onChange={handleChange} className="border p-2 w-full" />
          <button onClick={handleAdditionalSubmit} className="bg-green-500 text-white px-4 py-2 rounded w-full">
            다음 (이메일 인증)
          </button>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-gray-700">이메일로 받은 인증 코드를 입력해주세요.</p>
          <input
            placeholder="인증 코드"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            className="border p-2 w-full"
          />
          <button onClick={handleConfirmCode} className="bg-purple-600 text-white px-4 py-2 rounded w-full">
            인증 확인 및 회원가입 완료
          </button>
          {emailSent && (
            <button onClick={handleResendCode} className="bg-gray-500 text-white px-4 py-2 rounded w-full mt-4">
              인증 코드 재전송
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SignupPage;
