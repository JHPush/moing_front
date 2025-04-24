import React, { useEffect, useRef, useState } from "react";
import MoimPostWriteCard from "./MoimPostWriteCard";
import MoimPostCard from "./MoimPostCard";

// 뿌려주는 부분
const MoimPostComponent = ({ moim, user, isOpenPost, onSelectPost, posts, onPostCreated }) => {
    return (
        <main className="col-span-2">
          {/* 스크롤 가능한 카드 리스트 */}
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
            {isOpenPost ? <MoimPostWriteCard moim={moim} user={user} onPostCreated={onPostCreated}/> : null}
            {posts.length > 0 ? posts.map((post) => (
              <MoimPostCard key={post.id} post={post} onSelectPost={onSelectPost} />
            )): <p className="text-gray-400 text-center py-10">작성된 글이 없습니다. </p>}
          </div>
        </main>
      );
      
}

export default MoimPostComponent