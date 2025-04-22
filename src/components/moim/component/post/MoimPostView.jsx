import { useState } from 'react';
import { deleteMoimPost, updateMoimPost } from '../../../../api/moimAPI';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import MoimLocationModal from '../util/MoimPostLocationModal';

const MoimPostView = ({ post, user, onBack, updatePost }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [editData, setEditData] = useState({
        title: post.title,
        content: post.content,
        schedule: post.schedule,
        moim_addr: post.moim_addr || '',
        moim_x: post.moim_x || '',
        moim_y: post.moim_y || '',
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

    const handleOnUpdate = () => {
        console.log(editData)
        updateMoimPost({
            moim_id: post.gathering_id,
            id: post.id,
            title: editData.title,
            content: editData.content,
            schedule: editData.schedule,
            moim_addr: editData.moim_addr,
            moim_x: editData.moim_x,
            moim_y: editData.moim_y,
        }).then(data => {
            if (data.statusCode !== 200) {
                console.log(data)
                alert('수정 실패!')
                return
            }
            updatePost()
            alert('업데이트 성공');
            onBack();
        }).catch(e => {
            console.log('error : ', e);
        });
    };

    const handleOnDelete = () => {
        deleteMoimPost({
            moim_id: post.gathering_id,
            id: post.id,
        }).then(data => {
            if (data.statusCode !== 200) {
                alert('삭제 실패!')
                return
            }


            updatePost()
            alert('삭제 성공');
            onBack();
        }).catch(e => {
            console.log('error : ', e);
        });
    };

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
                            onChange={handleChange}
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                                onClick={() => setIsEditing(false)}
                            >
                                취소
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                onClick={handleOnUpdate}
                            >
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
                                    모임 일자: <span className="font-medium">{post.schedule}</span>
                                </p>
                                <p className="ml-6 mt-1">
                                    장소: <span className="font-medium">{post.moim_addr}</span>
                                </p>
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
                                    onClick={() => setIsEditing(true)}
                                >
                                    ✏️ 수정
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded text-sm"
                                    onClick={handleOnDelete}
                                >
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
