import React from "react";

const PhotoGallery = ({ files }) => {
    console.log(files)
  if (!files || files.allPresignedImg.length === 0) {
    return <p className="text-gray-400 text-center py-10">업로드된 사진이 없습니다.</p>;
  }

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {files.allPresignedImg.map((file, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg shadow hover:shadow-lg group transition-all"
        >
          <img
            src={file}
            alt={`photo-${index}`}
            className="w-full h-full object-cover aspect-square transform group-hover:scale-105 transition duration-300"
          />
        </div>
      ))}
    </div>
  );
};

export default PhotoGallery;
