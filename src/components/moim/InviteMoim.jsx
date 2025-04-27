import { useEffect, useState } from "react";
import axios from "axios";
import { getInvitation, postSendEmail } from "../../api/moimAPI";
import { useSelector } from "react-redux";

const InviteMoim = ({ moim_id, moim_category }) => {
  const [qrUrl, setQrUrl] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [email, setEmail] = useState('');
  const user = useSelector(state => state.user.user);
  const nickname = user.nickname;

  useEffect(() => {
    const fetchInviteData = async () => {
      try {
        const data = await getInvitation(moim_id, moim_category);
        setQrUrl(data.qr_url);
        setInviteUrl(data.invite_url);
      } catch (error) {
        console.error("초대 정보 불러오기 실패:", error);
      }
    };
    fetchInviteData();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    alert("링크가 복사되었습니다!");
  };

  const handleEmailInput = async () => {
    try {
      const response = await postSendEmail(moim_id, moim_category, email, nickname);
      const statusCode = response.data.statusCode;

      if (statusCode === 200) {
        setEmail('');
        alert("모임 초대 이메일 발송 완료!");
      } else if (statusCode === 403) {
        alert("이메일 인증 필요! 이메일을 인증해주세요.");
      } else if (statusCode === 404) {
        alert("존재하지 않는 이메일입니다.");
      } else {
        alert("이메일 발송 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg space-y-6">

      {/* QR 코드 */}
      {qrUrl && (
        <div className="flex flex-col items-center">
          <img src={qrUrl} alt="초대 QR 코드" className="w-48 h-48 rounded-lg mb-4" />
          <p className="text-gray-500 text-sm">QR 코드를 스캔해서 초대하기</p>
        </div>
      )}

      {/* 초대 링크 */}
      {inviteUrl && (
        <div className="flex">
          <input
            type="text"
            readOnly
            value={inviteUrl}
            className="flex-1 border border-gray-300 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleCopy}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-lg transition"
          >
            복사
          </button>
        </div>
      )}

      {/* 이메일로 초대 */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h2 className="text-lg font-semibold text-gray-700">이메일로 초대하기</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="초대할 이메일 주소 입력"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleEmailInput}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
        >
          초대 메일 보내기
        </button>
      </div>

    </div>
  );
};

export default InviteMoim;
