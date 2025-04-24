import React, { useState } from "react";

const PhotoGallery = ({ posts, selectedPost }) => {
  let isFileIn = false
  return (
    <>
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {posts.map(post=> post.files && post.files.map((file, index) => {
        isFileIn= true
        return (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg shadow hover:shadow-lg group transition-all cursor-pointer"
          onClick={() => selectedPost?.(post)}

        >
          <img
            src={file.presigned_url}
            alt={`photo-${index}`}
            className="w-full h-full object-cover aspect-square transform group-hover:scale-105 transition duration-300"
          />
        </div>
      )}))}
    </div>
    {isFileIn? <></> : <p className="text-gray-400 text-center py-10">업로드된 사진이 없습니다.</p>}

    </>
  );
};

export default PhotoGallery;
