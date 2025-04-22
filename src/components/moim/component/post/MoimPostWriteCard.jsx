import { useEffect, useRef, useState } from "react";
import { postMoimPost } from "../../../../api/moimAPI";
import DatePicker from "react-datepicker";
import MoimLocationModal from "../util/MoimPostLocationModal";

const initState = {
    moim_id: "",
    title: "",
    content: "",
    member_id: "",
    member_name: "",
    post_type: "",
    schedule: "",
    moim_addr: "",
    moim_x: "",
    moim_y: "",
};

const MoimPostWriteCard = ({ moim, user, onPostCreated }) => {
    const [post, setPost] = useState({ ...initState });
    const [selectedDate, setSelectedDate] = useState(null);
    const [showSchedule, setShowSchedule] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);

    const datePickerRef = useRef(null);

    const formatDateTime = (date) => {
        if (!date) return "날짜를 선택하세요";
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const hh = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    };

    const handleOnCheck = (e) => {
        const ptype = e.target.checked ? "Notice" : "";
        setPost({ ...post, post_type: ptype });
    };

    useEffect(() => {
        if (moim && user) {
            setPost((prev) => ({
                ...prev,
                moim_id: moim.id,
                member_id: user.userId,
                member_name: user.name,
            }));
        }
    }, []);


    const handleOnRegister = () => {
        const ptype = selectedDate ? "Scheduled" : "Normal";
        const finalPost = {
            ...post,
            schedule: showSchedule && selectedDate ? formatDateTime(selectedDate) : "",
            post_type: post.post_type === "Notice" ? post.post_type : ptype,
        };

        console.log(finalPost);

        if (finalPost.title === '' || finalPost.content === '') {
            alert("모두 작성해주세요");
            return;
        }
        if (showSchedule &&  (selectedDate === null || finalPost.moim_addr === '' || finalPost.moim_x === '')) {
            console.log(post)
            alert("일정 혹은 모임 위치를 등록해주세요");
            return;
        }

        postMoimPost(finalPost)
            .then((data) => {
                console.log(data)
                alert("게시글 등록 완료!");
                onPostCreated();
            })
            .catch((e) => {
                console.error("error : ", e);
            });
    };

    return (
        <div className="space-y-3">

            {/* ✅ 공지사항 */}
            {moim.owner_id === user.userId && (
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                    <input type="checkbox" onChange={handleOnCheck} className="w-4 h-4 accent-blue-500" />
                    <span className="text-1xl font-bold cursor-pointer">공지사항</span>
                </label>
            )}

            {/* ✅ 일정 영역 */}
            {!showSchedule ? (
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                    <span onClick={() => setShowSchedule(true)} className="text-1xl font-bold cursor-pointer">
                        📅 일정 등록
                    </span>
                </label>
            ) : (
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 mt-3">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-700">📅 일정 등록</span>
                        <button
                            type="button"
                            onClick={() => {
                                setShowSchedule(false);
                                setSelectedDate(null);
                                setPost({ ...post, moim_addr: '', moim_x: '', moim_y: '' })
                            }}
                            className="text-xs text-red-500 hover:underline"
                        >
                            일정 취소
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 날짜 선택 */}
                        <div>
                            <div
                                className="flex items-center gap-2 border px-3 py-2 rounded-md bg-white cursor-pointer hover:bg-gray-50"
                                onClick={() => datePickerRef.current.setOpen(true)}
                            >
                                <span>📅</span>
                                <span className="text-sm text-gray-700">
                                    {selectedDate ? formatDateTime(selectedDate) : "날짜 선택"}
                                </span>
                            </div>
                            <DatePicker
                                ref={datePickerRef}
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                showTimeSelect
                                dateFormat="yyyy-MM-dd HH:mm"
                                timeFormat="HH:mm"
                                className="hidden"
                                withPortal
                            />
                        </div>

                        {/* 위치 선택 */}
                        <div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
                                    onClick={() => setShowLocationModal(true)}
                                >
                                    📍 위치 선택
                                </button>
                                {post.moim_addr && (
                                    <span className="text-sm text-green-600">{post.moim_addr}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 위치 모달 */}
                    {showLocationModal && (
                        <MoimLocationModal
                            onClose={() => setShowLocationModal(false)}
                            onSelect={(addr) => setPost({...post, moim_addr:addr.selectedAddress, moim_x:addr.coord.x, moim_y:addr.coord.y})}
                        />
                    )}
                </div>
            )}

            {/* 제목 */}
            <input
                name="title"
                type="text"
                placeholder="제목을 입력해주세요."
                className="w-full p-2 border rounded-md text-sm"
                onChange={(e) => setPost({ ...post, [e.target.name]: e.target.value })}
            />

            {/* 내용 */}
            <textarea
                name="content"
                rows="3"
                placeholder="새로운 소식을 남겨보세요."
                className="w-full p-2 border rounded-md text-sm"
                onChange={(e) => setPost({ ...post, [e.target.name]: e.target.value })}
            ></textarea>

            {/* 툴 */}
            <div className="flex justify-center items-center space-x-4 text-gray-500">
                <span className="cursor-pointer">📷사진 등록</span>
            </div>

            {/* 등록 버튼 */}
            <button
                className="w-full mt-3 py-1.5 text-sm bg-blue-500 text-white rounded-md active:bg-blue-700 transition duration-150"
                onClick={handleOnRegister}
            >
                등록
            </button>
        </div>
    );
};

export default MoimPostWriteCard;
