import { useEffect, useState } from "react";
import MoimPostComponent from "./component/post/MoimPostComponent";
import MoimRecentPostCard from "./component/moim/MoimRecentPostCard";
import ProfileCard from "./component/moim/ProfileCard";
import MoimPostView from "./component/post/MoimPostViewCard";
import { useLocation, useNavigate } from "react-router-dom";
import InviteMoim from "./InviteMoim";
import PhotoGallery from "./component/PhotoGallery";
import MoimPostCalanderComponent from "./component/post/MoimPostCalanderComponent";
import { getAllPostImages, postPagePostByMoimId, putExitMoim } from "../../api/moimAPI";
import ChatMessageBox from "../Message/ChatMessageBox";





const MoimMainLayout = ({ moim, user }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [isOpenPost, setIsOpenPost] = useState(false)
    const [activeTab, setActiveTab] = useState("home");
    const [selectedPost, setSelectedPost] = useState(null); // 게시글 상세 보기용
    const [posts, setPosts] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [pageKey, setPageKey] = useState(null)
    const [postImgRes, setPostImgRes] = useState([])
    const [showChatPopup, setShowChatPopup] = useState(false);

    const id = searchParams.get('moimid');

    const nav = useNavigate()

    const getMoimPosts = async (id, limit = 5, key = null) => {
        if (!id) return;

        try {
            // 게시글과 이미지 병렬 요청
            const [postResRaw, imageResRaw] = await Promise.all([
                postPagePostByMoimId(id, limit, key),
                postImgRes.length === 0
                    ? getAllPostImages(id, 'moim-post-images')
                    : Promise.resolve(JSON.stringify(postImgRes))
            ]);
            const postRes = JSON.parse(postResRaw);
            setPageKey(postRes.last_evaluated_key)

            const images = postImgRes.length === 0 ? JSON.parse(imageResRaw) : postImgRes;

            setPostImgRes(images);


            // 게시글에 이미지 매핑
            const newPosts = postRes.posts.map(post => {
                const matched = images.filter(img => img.post_id === post.id);
                return {
                    ...post,
                    files: matched.length > 0 ? matched[0].files : []
                };
            });

            setPosts(prevPosts => {
                // 중복된 게시글 처리
                const uniqueNewPosts = newPosts.filter(newPost =>
                    !prevPosts.some(prevPost => prevPost.id === newPost.id)
                );

                return [...prevPosts, ...uniqueNewPosts];
            });
        } catch (error) {
            console.error("오류 발생:", error);
        }
    };


    const handleReload = () => {
        setReloadTrigger(prev => !prev);
    };

    useEffect(() => {
        if (id === null) return
        getMoimPosts(id, 5, pageKey);
    }, [id, reloadTrigger]);

    const handleOnExitMoim = () => {
        if (!window.confirm('정말 탈퇴하시겠습니까?'))
            return
        putExitMoim(moim.id, moim.category, user.userId).then(d => {
            console.log(d)
            alert('모임을 탈퇴했습니다')
        }).catch(e => {
            console.log('error', e)
        })
    }

    useEffect(() => {
        if (location.state?.activeTab === "postDetail" && location.state?.postId) {
            const targetPost = posts.find(p => String(p.id) === String(location.state.postId));

            if (targetPost) {
                setSelectedPost(targetPost);
                setActiveTab("postDetail");
            }
        }
    }, [location.state, posts]);



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
                            {activeTab === 'home' ?
                                <button className="w-full mt-3 py-1.5 text-sm bg-black text-white rounded-md active:bg-gray-700 transition duration-150" onClick={() => setIsOpenPost(!isOpenPost)}>글쓰기</button>
                                : <></>}



                            <button
                                className="w-full mt-3 py-1.5 text-sm bg-black text-white rounded-md"
                                onClick={() => setShowChatPopup(true)}
                            >
                                채팅
                            </button>

                            <div className="flex items-center text-gray-700 space-x-2 cursor-pointer hover:underline" onClick={e => setActiveTab('inviteMember')}>
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
                            <div className="text-gray-500 cursor-pointer hover:underline" onClick={handleOnExitMoim}>모임 탈퇴</div>

                        </div>
                    </aside>
                    <div className="col-span-2 min-h-[500px] max-h-[500px]">
                        {activeTab === "home" && (
                            <MoimPostComponent isOpenPost={isOpenPost} moim={moim} user={user} posts={posts} reloadTrigger={handleReload} onSelectPost={(post) => {
                                setSelectedPost(post);
                                setActiveTab("postDetail");
                            }} />
                        )}
                        {activeTab === "photo" && <PhotoGallery posts={posts} photos={postImgRes} selectedPost={(post) => { setSelectedPost(post); setActiveTab("postDetail"); }} />}
                        {activeTab === "schedule" && <MoimPostCalanderComponent moim={moim} posts={posts} selectedPost={(post) => { setSelectedPost(post); setActiveTab("postDetail"); }} />}
                        {/* {activeTab === "member" && <MemberList moim={moim} />} */}
                        {activeTab === 'inviteMember' && <InviteMoim moim_id={moim.id} moim_category={moim.category} />}
                        {activeTab === "postDetail" && selectedPost && (
                            <MoimPostView user={user} post={selectedPost} reloadTrigger={handleReload} onBack={() => setActiveTab("home")} />
                        )}
                    </div>
                    <MoimRecentPostCard post={posts.find(post => post.post_type === 'Scheduled')} onSelectPost={(post) => { setSelectedPost(post); setActiveTab("postDetail"); }} />

                </div>
            </div>
            {/* 채팅 팝업 */}
            {showChatPopup && (
                <ChatMessageBox
                    gatheringId={moim.id}
                    memberId={user?.userId}
                    onClose={() => setShowChatPopup(false)}
                />
            )}
        </div>

    );
}

export default MoimMainLayout