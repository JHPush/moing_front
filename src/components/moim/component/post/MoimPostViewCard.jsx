import { useState } from 'react';
import { deleteMoimPost, getPresignedURL_PostPut, putUploadMoimImageByPresignedUrl, updateMoimPost } from '../../../../api/moimAPI';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import MoimLocationModal from '../util/MoimPostLocationModal';
import MoimPostViewMap from './MoimPostViewMap';

// 게시글 보기 수정 삭제 카드
const MoimPostView = ({ post, user, onBack, reloadTrigger,handleFinishPostWriteOrUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [previewFiles, setPreviewFiles] = useState([])
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [editData, setEditData] = useState({
        title: post.title,
        content: post.content,
        schedule: post.schedule,
        moim_addr: post.moim_addr || '',
        moim_x: post.moim_x || '',
        moim_y: post.moim_y || '',
        files: []
    });


    // 3. 장소 선택 핸들러 추가
    const handleLocationSelect = (addr) => {
        setEditData({
            ...editData,
            moim_addr: addr.selectedAddress,
            moim_x: addr.coord.x,
            moim_y: addr.coord.y,
        });
    };

    const isAuthor = user?.userId === post.member_id;
    const isSchedule = post.post_type === 'Scheduled';

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setEditData({
            ...editData,
            schedule: dayjs(date).format('YYYY-MM-DD HH:mm'),
        });
    };

    const handleOnUpdate = async () => {
        const finalPost = { ...editData };
        try {
            if (finalPost.files.length > 0) {

                const requestData = finalPost.files.map(file => ({
                    filename: file.name,
                    filetype: file.type
                }))

                const res = await getPresignedURL_PostPut(requestData);
                const data = JSON.parse(res.data.body)

                const uploadPromises = data.map(async (file, idx) => {
                    await putUploadMoimImageByPresignedUrl(file.uploadUrl, finalPost.files[idx]);
                    return file.fileUrl;
                });


                const uploadUrls = await Promise.all(uploadPromises)
                console.log('uploadUrls : ', uploadUrls)
                finalPost.files = uploadUrls;
            }
            console.log(finalPost)
                updateMoimPost(JSON.stringify({
                    moim_id: post.gathering_id,
                    id: post.id,
                    title: finalPost.title,
                    content: finalPost.content,
                    schedule: finalPost.schedule,
                    moim_addr: finalPost.moim_addr,
                    moim_x: finalPost.moim_x,
                    moim_y: finalPost.moim_y,
                    files: finalPost.files
                })).then(data => {
                    if (data.statusCode !== 200) {
                        console.log(data)
                        alert('수정 실패!')
                        return
                    }
                    alert('수정 성공');
                    onBack();
                    
                    reloadTrigger()
                    handleFinishPostWriteOrUpdate()
                }).catch(e => {
                    console.log('error : ', e);
                });
        }
        catch (error) {
            console.error('Error Upload or Post', error)
            alert('에러 발생')
        }
    };

    const handleOnDelete = () => {
        deleteMoimPost({
            moim_id: post.gathering_id,
            id: post.id,
        }).then(data => {
            if (data.statusCode !== 200) {
                console.log(data)
                alert('삭제 실패!')
                return
            }
            reloadTrigger()
            handleFinishPostWriteOrUpdate()
            alert('삭제 성공');
            onBack();
        }).catch(e => {
            console.log('error : ', e);
        });
    };
    const handleOnFile = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            alert('최대 3개의 파일까지만 등록 가능합니다')
            return;
        }
        setEditData({ ...editData, files: files })

        const previews = files.map(file => URL.createObjectURL(file))
        setPreviewFiles(previews)
    }

    return (
        <main className="p-8 flex justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full min-h-[500px] relative flex flex-col">
                <button
                    className="absolute top-6 left-6 text-gray-600 hover:text-gray-800 text-xl"
                    onClick={onBack}
                    aria-label="뒤로가기"
                >
                    ←
                </button>

                {isEditing ? (
                    <>
                        <input
                            type="text"
                            name="title"
                            className="text-2xl font-bold text-gray-800 mb-4 w-full border-b pb-1 outline-none"
                            value={editData.title}
                            onChange={handleChange}
                        />
                        {isSchedule && (
                            <>
                                {/* 일정 선택 */}
                                <div className="mb-4">
                                    <label className="text-sm text-gray-600 block mb-1">모임 일자</label>
                                    <DatePicker
                                        selected={editData.schedule ? new Date(editData.schedule) : null}
                                        onChange={handleDateChange}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={30}
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        timeCaption="시간"
                                        className="w-full border rounded px-3 py-2 text-sm"
                                    />
                                </div>

                                {/* 장소 선택 */}
                                <div className="mb-4">
                                    <label className="text-sm text-gray-600 block mb-1">모임 장소</label>
                                    <div className="flex gap-2 items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowLocationModal(true)}
                                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                        >
                                            📍 장소 선택
                                        </button>
                                        {editData.moim_addr && (
                                            <span className="text-sm text-green-600">{editData.moim_addr}</span>
                                        )}
                                    </div>
                                </div>

                                {showLocationModal && (
                                    <MoimLocationModal
                                        onClose={() => setShowLocationModal(false)}
                                        onSelect={handleLocationSelect}
                                    />
                                )}
                            </>
                        )}

                        <textarea
                            name="content"
                            className="flex-1 text-base text-gray-700 border rounded-md p-3 h-64 resize-none"
                            value={editData.content}
                            onChange={handleChange} />

                        <div className='mt-4 flex justfy-end gap-2'>사진</div>
                        {(post.files && post.files.length > 0 && previewFiles.length === 0) && (
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {post.files.map((src, index) => (
                                    <img
                                        key={index}
                                        src={src.presigned_url}
                                        alt={`기존 이미지 ${index + 1}`}
                                        className="w-full aspect-square object-cover rounded-lg border"
                                    />
                                ))}
                            </div>
                        )}

                        {previewFiles.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {previewFiles.map((src, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={src}
                                            alt={`새 이미지 ${index + 1}`}
                                            className="w-full aspect-square object-cover rounded-lg border"
                                        />
                                        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 opacity-0 group-hover:opacity-100 transition">
                                            새 이미지
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 툴 */}
                        <label className="flex justify-center items-center space-x-4 text-gray-500 cursor-pointer mb-4">
                            📷 사진 등록 (최대 3장)
                            <input
                                type="file"
                                name="snapshot"
                                multiple
                                className="hidden"
                                accept="image/*"
                                onChange={handleOnFile}
                            />
                        </label>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                                onClick={() => { setIsEditing(false); setPreviewFiles([]) }}>
                                취소
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                onClick={handleOnUpdate}>
                                저장
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                            {post.title}
                        </h1>

                        {isSchedule && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3 text-blue-800 text-sm mb-6">
                                <p className="font-semibold flex items-center gap-2">
                                    📅 <span>모임이 있습니다!</span>
                                </p>
                                <p className="ml-6 mt-1">
                                    날자: <span className="font-medium">{post.schedule}</span>
                                </p>
                                <p className="ml-6 mt-1">
                                    장소: <span className="font-medium">{post.moim_addr}</span>
                                </p>
                                {post.moim_addr && post.moim_x && (
                                    <div className='mb-6'>
                                        <MoimPostViewMap x={post.moim_x} y={post.moim_y} addr={post.moim_addr} />
                                    </div>
                                )}
                            </div>
                        )}
                        {post.files && post.files.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {post.files.map((src, index) => (
                                    <img
                                        key={index}
                                        src={src.presigned_url}
                                        alt={`이미지 ${index + 1}`}
                                        className="w-full aspect-square object-cover rounded-lg border"
                                    />
                                ))}
                            </div>
                        )}

                        <div className="flex-1 text-gray-700 leading-relaxed whitespace-pre-wrap mb-6 text-base">
                            {post.content}
                        </div>
                        <div className="border-t pt-4 text-xs text-gray-500 flex justify-between">
                            <p>✍️ 작성자: {post.member_name}</p>
                            <p>🕒 작성일: {post.reg_date}</p>
                        </div>

                        {isAuthor && (
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                                    onClick={() => setIsEditing(true)}>
                                    ✏️ 수정
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded text-sm"
                                    onClick={handleOnDelete}>
                                    🗑️ 삭제
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
};

export default MoimPostView;
