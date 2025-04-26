import React, { useState } from "react";
import { getPresignedURL_put, putUpdateMoing, putUploadMoimImageByPresignedUrl } from "../../../../api/moimAPI";
import { useNavigate } from "react-router-dom";

const MoimEditModal = ({ moim, profile, onClose, moimRefresh }) => {
    const [shortDescription, setShortDescription] = useState(moim.short_description || '');
    const [introductionContent, setIntroductionContent] = useState(moim.introduction_content || '');
    const [newProfile, setNewProfile] = useState(null);
    const nav = useNavigate()


    const handleSave = async (e) => {
        if (shortDescription === '' || introductionContent === '') {
            console.log(moim);
            alert('모든 항목을 작성해주세요');
            return;
        }

        let file_url = ''
        try {
            if (newProfile) {
                console.log('새파일', newProfile)

                const data = await getPresignedURL_put(newProfile.name, newProfile.type);
                const temp = JSON.parse(data);
                file_url = temp.file_url;
                await putUploadMoimImageByPresignedUrl(temp.upload_url, newProfile);
            }
            console.log('파일 생성 완료')

            const updatedMoim = {
                moim_id: moim.id,
                moim_category: moim.category,
                short_description: shortDescription,
                introduction_content: introductionContent,
                file_url: newProfile ? file_url : moim.file_url,
                old_file_url: moim.file_url
            };

            console.log(updatedMoim);
            console.log("Request S3 Start !!");

            const putResult = await putUpdateMoing(updatedMoim);
            if (putResult.statusCode !== 200) {
                alert('모임 생성 실패');
                console.log(putResult);
                return;
            }

            console.log(putResult);

            alert('모임 수정 완료!');
            moimRefresh()
            onClose()

        } catch (e) {
            console.error('모임 수정 중 오류 발생: ', e);
            alert('모임 수정 중 오류가 발생했습니다.');
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-lg p-8 relative">
                {/* 닫기 버튼 */}
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                    onClick={onClose}
                >
                    ✖
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center">모임 정보 수정</h2>

                {/* 프로필 사진 */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden mb-3">
                        {newProfile ? (
                            <img src={URL.createObjectURL(newProfile)} alt="New Profile" className="w-full h-full object-cover" />
                        ) : (
                            <img src={profile} alt="Old Profile" className="w-full h-full object-cover" />
                        )}
                    </div>
                    <label className="cursor-pointer text-blue-500 text-sm hover:underline">
                        프로필 사진 변경
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => setNewProfile(e.target.files[0])}
                        />
                    </label>
                </div>

                {/* 간단 소개 */}
                <div className="mb-4">
                    <label className="text-sm font-semibold text-gray-700">모임 한줄소개</label>
                    <input
                        type="text"
                        className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                    />
                </div>

                {/* 상세 설명 */}
                <div className="mb-6">
                    <label className="text-sm font-semibold text-gray-700">모임 상세소개</label>
                    <textarea
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg resize-none h-32"
                        value={introductionContent}
                        onChange={(e) => setIntroductionContent(e.target.value)}
                    />
                </div>

                {/* 저장 버튼 */}
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300"
                        onClick={onClose}
                    >
                        취소
                    </button>
                    <button
                        className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        onClick={handleSave}
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoimEditModal;
