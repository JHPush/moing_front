import React, { useState } from 'react';
import { userPool } from '../../aws-config';
import { postUserToLambda, verifyEmailBySES } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userSub, setUserSub] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [cognitoUser, setCognitoUser] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    name: '',
    nickname: '',
    gender: '',
    birth: '',
    phoneNumber: '',
  });

  const handleChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    const { email, password } = signupData;
    if (!email || !password) return '이메일과 비밀번호를 모두 입력해주세요.';
    if (!/\S+@\S+\.\S+/.test(email)) return '유효한 이메일 형식을 입력해주세요.';
    if (password.length < 8) return '비밀번호는 최소 8자 이상이어야 합니다.';
    return '';
  };

  const handleInitialSignup = () => {
    const validationError = validateStep1();
    if (validationError) return setErrorMsg(validationError);

    setIsLoading(true);
    const { email, password } = signupData;

    userPool.signUp(email, password, [{ Name: 'email', Value: email }], null, (err, result) => {
      setIsLoading(false);
      if (err) return setErrorMsg(err.message || '회원가입 실패');

      const sub = result?.userSub || result?.user?.username;
      setUserSub(sub);
      setCognitoUser(result.user);
      setEmailSent(true);
      setStep(2);
    });
  };

  const handleAdditionalSubmit = async () => {
    setIsLoading(true);
    const payload = { userId: userSub, ...signupData };

    try {
      const res = await postUserToLambda(payload);
      if (res.ok) {
        alert('추가 정보 저장 완료! 이메일 인증 코드를 입력해주세요.');
        setStep(3);
      } else {
        setErrorMsg('Lambda 저장 실패: 서버 응답 오류');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCode = async () => {
    if (!cognitoUser) return alert('사용자 정보가 없습니다. 다시 시도해주세요.');

    setIsLoading(true);
    cognitoUser.confirmRegistration(confirmationCode, true, async (err, result) => {
      if (err) {
        setErrorMsg('인증 실패: ' + (err.message || '코드를 확인해주세요.'));
        setIsLoading(false);
        return;
      }

      try {
        console.log("asdfasfasdfasfsadf");
        const response = await verifyEmailBySES(signupData.email);
        console.log("response : ", response);
        const data = await response.json();
        console.log("data : ", data);
        if (response.ok) {
          alert('회원가입이 완료되었습니다! 이메일 인증 메일을 확인해주세요.');
          navigate('/login');
        } else {
          setErrorMsg('SES 인증 실패: ' + data.error);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('서버 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleResendCode = () => {
    if (!cognitoUser) return alert('사용자 정보가 없습니다.');

    cognitoUser.resendConfirmationCode((err) => {
      if (err) return alert('재전송 실패: ' + (err.message || '알 수 없는 오류'));
      alert('이메일 인증 코드가 재전송되었습니다.');
    });
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">회원가입</h2>

      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <input name="email" placeholder="이메일" onChange={handleChange} className="border p-2 w-full" />
          <input name="password" type="password" placeholder="비밀번호 (8자 이상)" onChange={handleChange} className="border p-2 w-full" />
          <button onClick={handleInitialSignup} disabled={isLoading} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
            {isLoading ? '처리 중...' : '다음'}
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <input name="name" placeholder="이름" onChange={handleChange} className="border p-2 w-full" />
          <input name="nickname" placeholder="닉네임" onChange={handleChange} className="border p-2 w-full" />

          {/* 성별 버튼 */}
          <div className="flex gap-4">
            <button
              type="button"
              className={`flex-1 p-2 border rounded ${signupData.gender === 'MALE' ? 'bg-blue-500 text-white' : 'bg-white text-black'
                }`}
              onClick={() => setSignupData({ ...signupData, gender: 'MALE' })}
            >
              남성
            </button>
            <button
              type="button"
              className={`flex-1 p-2 border rounded ${signupData.gender === 'FEMALE' ? 'bg-pink-500 text-white' : 'bg-white text-black'
                }`}
              onClick={() => setSignupData({ ...signupData, gender: 'FEMALE' })}
            >
              여성
            </button>
          </div>

          {/* 생년월일 드롭다운 */}
          <div className="flex gap-2">
            <select
              className="border p-2 flex-1"
              onChange={(e) =>
                setSignupData({ ...signupData, birth: `${e.target.value}-${signupData.birth.split('-')[1] || '01'}-${signupData.birth.split('-')[2] || '01'}` })
              }
              defaultValue=""
            >
              <option value="" disabled>년</option>
              {Array.from({ length: 100 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>

            <select
              className="border p-2 flex-1"
              onChange={(e) =>
                setSignupData({ ...signupData, birth: `${signupData.birth.split('-')[0] || '2000'}-${e.target.value}-${signupData.birth.split('-')[2] || '01'}` })
              }
              defaultValue=""
            >
              <option value="" disabled>월</option>
              {Array.from({ length: 12 }, (_, i) => {
                const month = String(i + 1).padStart(2, '0');
                return <option key={month} value={month}>{month}</option>;
              })}
            </select>

            <select
              className="border p-2 flex-1"
              onChange={(e) =>
                setSignupData({ ...signupData, birth: `${signupData.birth.split('-')[0] || '2000'}-${signupData.birth.split('-')[1] || '01'}-${e.target.value}` })
              }
              defaultValue=""
            >
              <option value="" disabled>일</option>
              {Array.from({ length: 31 }, (_, i) => {
                const day = String(i + 1).padStart(2, '0');
                return <option key={day} value={day}>{day}</option>;
              })}
            </select>
          </div>

          <input name="phoneNumber" placeholder="전화번호( - 없이 숫자만 입력해주세요 )" onChange={handleChange} className="border p-2 w-full" />
          <button onClick={handleAdditionalSubmit} disabled={isLoading} className="bg-green-500 text-white px-4 py-2 rounded w-full">
            {isLoading ? '저장 중...' : '다음 (이메일 인증)'}
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
          <button onClick={handleConfirmCode} disabled={isLoading} className="bg-purple-600 text-white px-4 py-2 rounded w-full">
            {isLoading ? '확인 중...' : '인증 확인 및 회원가입 완료'}
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
