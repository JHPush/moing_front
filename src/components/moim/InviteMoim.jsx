import { useEffect, useState } from "react";
import axios from "axios";
import { getInvitation, postSendEmail } from "../../api/moimAPI";
import { useSelector } from "react-redux";

const InviteMoim = ({moim_id, moim_category}) => {
  const [qrUrl, setQrUrl] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [email, setEmail] = useState('');
  const user = useSelector(state => state.user.user)
  const nickname = user.nickname;

  useEffect(() => {
    const fetchInviteData = async () => {
        try {
        const data = await getInvitation(moim_id, moim_category);
        console.log("cate: ",moim_category)
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

    try {
      const response = await postSendEmail(moim_id, moim_category, email, nickname);
      console.log('response: ', response)
      const statusCode = response.data.statusCode;

      if (statusCode === 200) {
        setEmail('');
        alert("모임 초대 이메일이 성공적으로 발송되었습니다.");
        console.log("이메일 전송 성공");
  
      } else if (statusCode === 403) {
        alert("사용자 메일 인증이 되어 있지 않아 이메일을 전송할 수 없습니다.\n이메일을 확인해 인증을 완료해주세요.");
        console.log("이메일 전송 실패: SES 인증 오류");
  
      } else if (statusCode === 404) {
        alert("해당 이메일을 가진 사용자가 존재하지 않습니다.\n이메일 주소를 다시 확인해 주세요.");
        console.log("이메일 전송 실패: 사용자 없음");
  
      } else if (statusCode === 500) {
        alert("서버 오류로 인해 이메일 전송에 실패했습니다.\n잠시 후 다시 시도해 주세요.");
        console.log("이메일 전송 실패: 서버 오류");
  
      } else {
        alert("알 수 없는 오류가 발생했습니다. 콘솔을 확인해 주세요.");
        console.log("이메일 전송 실패: 알 수 없는 오류", statusCode);
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
