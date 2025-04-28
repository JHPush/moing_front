import { useEffect, useRef, useState } from "react";
import { getPresignedURL_PostPut, postMoimPost, putUploadMoimImageByPresignedUrl } from "../../../../api/moimAPI";
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
    category: "",
    files: []
};

// Character limits
const TITLE_MIN_LENGTH = 1;
const TITLE_MAX_LENGTH = 25;
const CONTENT_MIN_LENGTH = 1;
const CONTENT_MAX_LENGTH = 200;

// 게시글 작성
const MoimPostWriteCard = ({ moim, user, reloadTrigger, handleFinishPostWriteOrUpdate }) => {
    const [post, setPost] = useState({ ...initState });
    const [selectedDate, setSelectedDate] = useState(null);
    const [showSchedule, setShowSchedule] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [previewFiles, setPreviewFiles] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);

    // Character count states
    const [titleCharCount, setTitleCharCount] = useState(0);
    const [contentCharCount, setContentCharCount] = useState(0);
    const [isTitleExceeded, setIsTitleExceeded] = useState(false);
    const [isContentExceeded, setIsContentExceeded] = useState(false);

    const datePickerRef = useRef(null);

    const formatDateTime = (date) => {
        if (!date) return "날짜를 선택하세요";

        const kstDate = new Date(date.getTime());

        const yyyy = kstDate.getFullYear();
        const mm = String(kstDate.getMonth() + 1).padStart(2, "0");
        const dd = String(kstDate.getDate()).padStart(2, "0");
        const hh = String(kstDate.getHours()).padStart(2, "0");
        const min = String(kstDate.getMinutes()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    };

    const handleOnCheck = (e) => {
        const ptype = e.target.checked ? "Notice" : "";
        if (ptype === "Notice" && showSchedule) {
            alert('공지사항에 일정을 등록 할 수 없습니다')
            e.target.checked = false
            return
        }
        setPost({ ...post, post_type: ptype });
    };

    useEffect(() => {
        if (moim && user) {
            setPost((prev) => ({
                ...prev,
                moim_id: moim.id,
                member_id: user.userId,
                member_name: user.nickname,
                category: moim.category
            }));
        }
    }, []);

    // Check if title length exceeds limit
    useEffect(() => {
        setTitleCharCount(post.title.length);
        setIsTitleExceeded(post.title.length > TITLE_MAX_LENGTH);
    }, [post.title]);

    // Check if content length exceeds limit
    useEffect(() => {
        setContentCharCount(post.content.length);
        setIsContentExceeded(post.content.length > CONTENT_MAX_LENGTH);
    }, [post.content]);

    const handleOnFile = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            alert('최대 3개의 파일까지만 등록 가능합니다');
            return;
        }
        setImageFiles(files);

        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewFiles(previews);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value });
    };

    const handleOnRegister = async () => {
        const ptype = selectedDate ? "Scheduled" : "Normal";
        const finalPost = {
            ...post,
            schedule: showSchedule && selectedDate ? formatDateTime(selectedDate) : "",
            post_type: post.post_type === "Notice" ? post.post_type : ptype,
        };

        // Check for empty fields
        if (finalPost.title.length < TITLE_MIN_LENGTH || finalPost.content.length < CONTENT_MIN_LENGTH) {
            alert("제목과 내용을 모두 작성해주세요");
            return;
        }

        // Check for exceeded character limits
        if (finalPost.title.length > TITLE_MAX_LENGTH) {
            alert(`제목 글자수가 초과되었습니다. (현재: ${titleCharCount}자)`);
            return;
        }

        if (finalPost.content.length > CONTENT_MAX_LENGTH) {
            alert(`내용 글자수가 초과 되었습니다. (현재: ${contentCharCount}자)`);
            return;
        }

        // Check for schedule requirements
        if (showSchedule && (selectedDate === null || finalPost.moim_addr === '' || finalPost.moim_x === '')) {
            alert("일정 혹은 모임 위치를 등록해주세요");
            return;
        }

        try {
            if (imageFiles.length > 0) {
                setImageUrls([]);
                const requestData = imageFiles.map(file => ({
                    filename: file.name,
                    filetype: file.type
                }));

                const res = await getPresignedURL_PostPut(requestData);
                const data = JSON.parse(res.data.body);

                const uploadPromises = data.map(async (file, idx) => {
                    await putUploadMoimImageByPresignedUrl(file.uploadUrl, imageFiles[idx]);
                    return file.fileUrl;
                });

                const uploadUrls = await Promise.all(uploadPromises);
                console.log('uploadUrls : ', uploadUrls);
                finalPost.files = uploadUrls;
            }

            const finalRes = await postMoimPost(JSON.stringify(finalPost));
            console.log('게시글 등록 결과 : ', finalRes);
            alert('게시글 등록 완료');
            handleFinishPostWriteOrUpdate();
            reloadTrigger();
        }
        catch (error) {
            console.error('Error Upload or Post', error);
            alert('에러 발생');
        }
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
                    <span onClick={() => {
                        if (post.post_type === "Notice") {
                            alert('공지사항은 일정을 등록 할 수 없습니다')
                            return
                        }
                        setShowSchedule(true)
                    }
                    } className="text-1xl font-bold cursor-pointer">
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
                            onSelect={(addr) => setPost({ ...post, moim_addr: addr.selectedAddress, moim_x: addr.coord.x, moim_y: addr.coord.y })}
                        />
                    )}
                </div>
            )}

            {/* 제목 */}
            <div className="relative">
                <input
                    name="title"
                    type="text"
                    placeholder="제목을 입력해주세요."
                    className={`w-full p-2 border rounded-md text-sm ${isTitleExceeded ? 'border-red-500' : ''}`}
                    onChange={handleInputChange}
                    value={post.title}
                />
                <div className={`flex justify-end text-xs mt-1 ${isTitleExceeded ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                    {titleCharCount}/{TITLE_MAX_LENGTH}
                </div>
            </div>

            {/* 내용 */}
            <div className="relative">
                <textarea
                    name="content"
                    rows="3"
                    placeholder="새로운 소식을 남겨보세요."
                    className={`w-full p-2 border rounded-md text-sm ${isContentExceeded ? 'border-red-500' : ''}`}
                    onChange={handleInputChange}
                    value={post.content}
                ></textarea>
                <div className={`flex justify-end text-xs mt-1 ${isContentExceeded ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                    {contentCharCount}/{CONTENT_MAX_LENGTH}
                </div>
            </div>

            {/* 툴 */}
            <label className="flex justify-center items-center space-x-4 text-gray-500 cursor-pointer">
                📷사진 등록
                <input type="file" name="snapshot" multiple className="hidden" onChange={handleOnFile} accept="image/*" />
            </label>
            {previewFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {previewFiles.map((url, idx) => {
                        return (<img key={idx} src={url} alt="미리보기" className="w-24 h-24 object-cover rounded-md" />)
                    })}
                </div>
            )}

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
