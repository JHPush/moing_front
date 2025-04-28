import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PREFIX_URL = process.env.REACT_APP_PREFIX_URL;

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const { user } = useSelector((state) => state.user);
  const idToken = user?.idToken;
  const nav = useNavigate();

  useEffect(() => {
    if (idToken) fetchProfile();
  }, [idToken]);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${PREFIX_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      setProfile(data);
    } catch (error) {
      console.error('프로필 로드 실패:', error);
    }
  };

  const handleEditClick = (fieldName) => {
    setEditingField(fieldName);
    setEditedValue(profile[fieldName] || '');
  };

  const handleSaveClick = async () => {
    if (!editingField) return;
    try {
      const updateData = { [editingField]: editedValue };
      await updateProfile(updateData);
      setProfile((prev) => ({ ...prev, ...updateData }));
      resetEditMode();
      alert('수정 완료!');
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert('수정 실패!');
    }
  };

  const handleCancelClick = () => resetEditMode();

  const resetEditMode = () => {
    setEditingField(null);
    setEditedValue('');
  };

  const updateProfile = async (updateData) => {
    await axios.put(`${PREFIX_URL}/users/profile`, updateData, {
      headers: { Authorization: `Bearer ${idToken}` }
    });
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { data: presignedData } = await axios.post(`${PREFIX_URL}/users/presigned-url`, {
        fileName: file.name,
        fileType: file.type
      }, {
        headers: { Authorization: `Bearer ${idToken}` }
      });

      await axios.put(presignedData.uploadUrl, file, {
        headers: { 'Content-Type': file.type }
      });

      await updateProfile({ profileImageUrl: presignedData.fileUrl });
      setProfile((prev) => ({ ...prev, profileImageUrl: presignedData.fileUrl }));
      alert('프로필 사진이 변경되었습니다!');
    } catch (error) {
      console.error('프로필 이미지 변경 실패:', error);
      alert('프로필 이미지 변경에 실패했습니다.');
    }
  };

  if (!profile) return <div>Loading...</div>;

  const profileFields = [
    { label: "이메일", field: "email", editable: false },
    { label: "닉네임", field: "nickname", editable: true },
    { label: "이름", field: "name", editable: true },
    { label: "전화번호", field: "phoneNumber", editable: true },
    { label: "성별", field: "gender", editable: true },
    { label: "생년월일", field: "birth", editable: true }
  ];

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">내 프로필</h1>

      {/* 프로필 이미지 업로드 */}
      <div className="relative group cursor-pointer mb-6">
        <label htmlFor="profileImageInput" className="cursor-pointer">
          <img
            src={profile.profileImageUrl || "/default_profile.png"}
            alt="프로필 이미지"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 group-hover:border-blue-500 transition"
          />
        </label>
        <input
          id="profileImageInput"
          type="file"
          accept="image/*"
          onChange={handleProfileImageChange}
          className="hidden"
        />
      </div>

      {/* 프로필 정보 수정 */}
      <div className="text-lg space-y-4 w-full max-w-md">
        {profileFields.map(({ label, field, editable }) => (
          <div key={field} className="flex items-center justify-between border-b py-2">
            <div className="font-semibold">{label}</div>
            <div className="flex items-center space-x-2">
              {editingField === field ? (
                <>
                  <input
                    type="text"
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    className="border p-1 rounded w-40"
                  />
                  <button onClick={handleSaveClick} className="bg-green-500 text-white px-2 py-1 rounded text-sm">저장</button>
                  <button onClick={handleCancelClick} className="bg-gray-400 text-white px-2 py-1 rounded text-sm">취소</button>
                </>
              ) : (
                <>
                  <span>{profile[field] || "입력 없음"}</span>
                  {editable && (
                    <button onClick={() => handleEditClick(field)} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">수정</button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
