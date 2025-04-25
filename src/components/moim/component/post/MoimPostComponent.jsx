import React, { useEffect, useRef, useState } from "react";
import MoimPostWriteCard from "./MoimPostWriteCard";
import MoimPostCard from "./MoimPostCard";

const MoimPostComponent = ({ moim, user, isOpenPost, reloadTrigger, posts, onSelectPost }) => {
    const [isFetching, setIsFetching] = useState(false);
    const observerTarget = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isFetching) {
                setIsFetching(true);
                reloadTrigger(); // 새 데이터 요청
            }
        }, { threshold: 1 });

        if (observerTarget.current) observer.observe(observerTarget.current);
        return () => observer.disconnect();
    }, [isFetching]);

    useEffect(() => {
        setIsFetching(false); // 새 데이터 로드되면 다시 false로 변경
    }, [posts]);

    return (
        <main className="col-span-2">
            {/* 스크롤 가능한 카드 리스트 */}
            <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                {isOpenPost && <MoimPostWriteCard moim={moim} user={user} reloadTrigger={reloadTrigger} />}
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                      <MoimPostCard key={`${post.id}-${index}`} post={post} onSelectPost={onSelectPost} />
                    ))
                ) : (
                    <p className="text-gray-400 text-center py-10">작성된 글이 없습니다.</p>
                )}
                <div ref={observerTarget} className="h-10"></div>
            </div>
        </main>
    );
};

export default MoimPostComponent;