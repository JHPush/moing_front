import ProfileCard from "./component/ProfileCard";


const MoimMain = ({ moim, user }) => {
    return (
        <div className="bg-gray-50 min-h-screen py-6 px-4 flex justify-center font-[Pretendard]">
            <div className="w-full max-w-6xl">
                {/* Navigation */}
                <nav className="flex justify-center space-x-6 text-sm font-medium text-gray-600 border-b pb-3 mb-6">
                    <span className="text-black border-b-2 border-black pb-1 cursor-pointer">홈</span>
                    <span className="hover:text-black cursor-pointer">사진첩</span>
                    <span className="hover:text-black cursor-pointer">일정</span>
                    <span className="hover:text-black cursor-pointer">멤버</span>
                </nav>

                <div className="grid grid-cols-4 gap-4">
                    {/* Sidebar */}
                    <aside className="col-span-1 space-y-4">
                        <ProfileCard moim={moim} user={user} />
                        <div className="text-sm space-y-2 pl-2">
                            <button className="w-full mt-3 py-1.5 text-sm bg-black text-white rounded-md">글쓰기</button>
                            <div className="text-gray-500 cursor-pointer hover:underline">불법 모임 신고</div>
                            <div className="flex items-center text-gray-700 space-x-2 cursor-pointer hover:underline">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 12a4 4 0 100-8 4 4 0 000 8zm12 0a4 4 0 11-8 0 4 4 0 018 0zM3 20h6v-2a3 3 0 00-6 0v2z"
                                    />
                                </svg>
                                <span>멤버초대하기</span>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="col-span-2 space-y-4">
                        {/* Search & Input */}
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="채팅 내용, #태그 검색"
                                className="w-full p-2 border rounded-md text-sm"
                            />
                            <textarea
                                rows="3"
                                placeholder="새로운 소식을 남겨보세요."
                                className="w-full p-2 border rounded-md text-sm"
                            ></textarea>
                            <div className="flex space-x-4 text-gray-500">
                                <span className="cursor-pointer">🏠</span>
                                <span className="cursor-pointer">📷</span>
                                <span className="cursor-pointer">📅</span>
                                <span className="cursor-pointer">📍</span>
                                <span className="cursor-pointer">⏰</span>
                            </div>
                        </div>

                        {/* 공지사항 */}
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <h3 className="font-semibold mb-1">공지사항</h3>
                            <p className="text-sm text-gray-700">
                                최근 모임에서 불미스러운 사건이 있었습니다. 해당 문제를 공식 게시판에 신고 처리하였습니다.
                            </p>
                            <div className="text-xs text-blue-500 cursor-pointer mt-2">Show more</div>
                        </div>

                        {/* 게시글 */}
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <h3 className="font-semibold mb-1">게시글</h3>
                            <p className="text-sm text-gray-700">
                                최근 모임에서 불미스러운 사건이 있었습니다. 아직 등록된 게시글이 없습니다.
                            </p>
                            <div className="text-xs text-blue-500 cursor-pointer mt-2">Show more</div>
                        </div>
                    </main>

                    {/* Right Sidebar */}
                    <aside className="col-span-1 space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <h3 className="font-semibold mb-1">최근 모임 공지</h3>
                            <p className="text-sm text-gray-700">
                                📅 05.10 정기 모임 공지 - 강남역 근처에서 예정되어 있습니다. 자세한 위치와 멤버들은 곧 안내드릴게요.
                            </p>
                            <div className="text-xs text-blue-500 cursor-pointer mt-2">Show more</div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default MoimMain