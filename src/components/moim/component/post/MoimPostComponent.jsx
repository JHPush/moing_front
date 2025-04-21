import React, { useEffect, useRef, useState } from "react";
import MoimPostWriteCard from "./MoimPostWriteCard";
import MoimPostCard from "./MoimPostCard";
import { getAllPostByMoimId } from "../../../../api/moimAPI";

const MoimPostComponent = ({ moim, user, isOpenPost, onSelectPost, posts, onPostCreated }) => {
    return (
        <main className="col-span-2 space-y-4">
            {isOpenPost ? <MoimPostWriteCard moim={moim} user={user} onPostCreated={onPostCreated}/> : <></>}
            {posts.length > 0 && posts.map((post) => (
                <MoimPostCard post={post} onSelectPost={onSelectPost} />
            ))}
        </main>
    );
}

export default MoimPostComponent