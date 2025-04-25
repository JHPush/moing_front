import { useEffect, useState } from "react";
import { getMoimMembers, getPendingMembers, approveMember } from "../../../../api/moimAPI";

const MemberList = ({ moim }) => {
  const [members, setMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);

  const fetchMembers = async () => {
    try {
      const data = await getMoimMembers(moim.id);
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      const membersArray = Array.isArray(parsed) ? parsed : parsed.members || [];
      setMembers(membersArray);
    } catch (error) {
      console.error("멤버 불러오기 실패:", error);
    }
  };

  const fetchPending = async () => {
    try {
      const pending = await getPendingMembers(moim.id);
      console.log("pending : ", pending);
      setPendingMembers(pending.pendingMembers || []);
    } catch (error) {
      console.error("가입 대기자 불러오기 실패:", error);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await approveMember(userId, moim.id, moim.category);
      alert("가입 수락 완료!");
      fetchMembers(); // 새로고침
      fetchPending();
    } catch (err) {
      alert("가입 수락 실패");
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchPending();
  }, [moim.id]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">모임 멤버</h2>
      {members.map(member => (
        <div key={member.userId} className="flex items-center space-x-4 p-2 border rounded-md shadow-sm">
          <img src={member.profileImageUrl} alt="프로필" className="w-10 h-10 rounded-full" />
          <span>{member.nickname}</span>
        </div>
      ))}

      <hr className="my-4" />

      {pendingMembers.length > 0 && (
        <>
          <h2 className="text-lg font-bold text-orange-600">가입 신청자</h2>
          {pendingMembers.map(member => (
            <div key={member.userId} className="flex items-center justify-between p-2 border rounded-md shadow-sm">
              <div className="flex items-center space-x-4">
                <img src={member.profileImageUrl} alt="프로필" className="w-10 h-10 rounded-full" />
                <span>{member.nickname}</span>
              </div>
              <button
                onClick={() => handleApprove(member.userId)}
                className="px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded"
              >
                수락
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default MemberList;
