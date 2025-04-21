import { useEffect, useState } from "react";
import MoimPostComponent from "./component/post/MoimPostComponent";
import MoimRecentPostCard from "./component/moim/MoimRecentPostCard";
import ProfileCard from "./component/moim/ProfileCard";
import MoimPostView from "./component/post/MoimPostView";
import MoimPostCard from "./component/post/MoimPostCard";
import { getAllPostByMoimId } from "../../api/moimAPI";


const MoimMainLayout = ({ moim, user, posts, handlePostCreated }) => {
    const [isOpenPost, setIsOpenPost] = useState(false)
    const [activeTab, setActiveTab] = useState("home");
    const [selectedPost, setSelectedPost] = useState(null); // 게시글 상세 보기용


    return (
        <div className="bg-gray-50 min-h-screen py-6 px-4 flex justify-center font-[Pretendard]">
            <div className="w-full max-w-6xl">
                {/* Navigation */}
                    <nav className="flex justify-center space-x-6 text-sm font-medium text-gray-600 border-b pb-3 mb-6">
                        <span
                            className={`${activeTab === "home" ? "text-black border-b-2 border-black" : "hover:text-black"} pb-1 cursor-pointer`}
                            onClick={() => setActiveTab("home")} >
                            홈
                        </span>
                        <span
                            className={`${activeTab === "photo" ? "text-black border-b-2 border-black" : "hover:text-black"} pb-1 cursor-pointer`}
                            onClick={() => setActiveTab("photo")} >
                            사진첩
                        </span>
                        <span
                            className={`${activeTab === "schedule" ? "text-black border-b-2 border-black" : "hover:text-black"} pb-1 cursor-pointer`}
                            onClick={() => setActiveTab("schedule")}>
                            일정
                        </span>
                        <span
                            className={`${activeTab === "member" ? "text-black border-b-2 border-black" : "hover:text-black"} pb-1 cursor-pointer`}
                            onClick={() => setActiveTab("member")}>
                            멤버
                        </span>
                    </nav>

                <div className="grid grid-cols-4 gap-4">
                    {/* Sidebar */}
                    <aside className="col-span-1 space-y-4">
                        <ProfileCard moim={moim} user={user} />
                        <div className="text-sm space-y-2 pl-2">
                            <button className="w-full mt-3 py-1.5 text-sm bg-black text-white rounded-md active:bg-gray-700 transition duration-150" onClick={() => setIsOpenPost(!isOpenPost)}>글쓰기</button>
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
                    <div className="col-span-2 min-h-[500px] max-h-[500px]">
                        {activeTab === "home" && (
                            <MoimPostComponent isOpenPost={isOpenPost} moim={moim} user={user} posts={posts} onPostCreated={handlePostCreated} onSelectPost={(post) => {
                                setSelectedPost(post);
                                setActiveTab("postDetail");
                            }} />
                        )}
                        {/* {activeTab === "photo" && <PhotoGallery moim={moim} />} */}
                        {/* {activeTab === "schedule" && <ScheduleComponent moim={moim} />} */}
                        {/* {activeTab === "member" && <MemberList moim={moim} />} */}
                        {activeTab === "postDetail" && selectedPost && (
                            <MoimPostView user = {user} post={selectedPost} updatePost={handlePostCreated} onBack={() => setActiveTab("home")} />
                        )}
                    </div>
                    <MoimRecentPostCard />

                </div>
            </div>
        </div>
    );
}

export default MoimMainLayout