import { useEffect, useState } from "react";
import axios from "axios";
import { getInvitation, postSendEmail } from "../../api/moimAPI";
import {  useSearchParams } from "react-router-dom";

const InviteMoim = () => {
  const [qrUrl, setQrUrl] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [email, setEmail] = useState('');
  const[searchParams]= useSearchParams();


  const moimid = searchParams.get("moimid");
  const category = searchParams.get("category");


  useEffect(() => {
    const fetchInviteData = async () => {
        try {
        const data = await getInvitation(moimid);
        console.log("data:", data)
        setQrUrl(data.qr_url);
        setInviteUrl(data.invite_url);
        } catch (error) {
        console.error("초대 정보 불러오기 실패:", error);
        }
    };
        fetchInviteData(); // 컴포넌트 마운트 시 바로 실행
}, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
  };


  const handleEmailInput = async () => {
    console.log("email:", email);
    console.log("moimid:", moimid);
    console.log("category:", category);

    try {
      const response = await postSendEmail(moimid, category, email);
      console.log('response: ', response)

      if (response.data.statusCode === 200) {
        // setEmailSent(true);
        setEmail(''); 
        alert("모임 초대 이메일이 발송되었습니다")
        console.log("이메일 전송 성공");
      }  else {
        console.log("이메일 전송 실패.statusCode:", response.data.statusCode);
      }
    } catch (error) {
        console.error(error);
    }
  }   
   
    

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded">
    <h2 className="text-lg font-semibold mb-4">모임
      
       초대 정보</h2>

    {qrUrl && (
      <div className="mb-4">
        <img src={qrUrl} alt="초대 QR 코드" className="w-48 h-48 mx-auto" />
      </div>
    )}

    {inviteUrl && (
      <div className="flex items-center">
        <input
          type="text"
          readOnly
          value={inviteUrl}
          className="border p-2 flex-1 rounded-l"
        />
        <button
          onClick={handleCopy}
          className="bg-gray-300 px-4 rounded-r hover:bg-gray-400"
        >
          복사하기
        </button>
      </div>
    )}

<div className="p-4 border rounded w-full max-w-md">
      <h2 className="text-lg font-semibold mb-2">이메일로 초대하기</h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일 주소 입력"
        className="border px-3 py-2 w-full rounded mb-2"
      />

      <button
        onClick={handleEmailInput}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >send
      </button>

     
    </div>
  </div>

  );
};

export default InviteMoim;
