import React, { useState } from "react";

const PhotoGallery = ({ posts, photos, selectedPost }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  let isFileIn = false
  return (
    <>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        {photos.map(photo => photo && photo.files.map((file, index) => {
          isFileIn = true
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow hover:shadow-lg group transition-all cursor-pointer"
              onClick={() => setSelectedImage(file.presigned_url)}
            >
              <img
                src={file.presigned_url}
                alt={`photo-${index}`}
                className="w-full h-full object-cover aspect-square transform group-hover:scale-105 transition duration-300"
              />
            </div>
          )
        }))}
      </div>
      {isFileIn ? <></> : <p className="text-gray-400 text-center py-10">업로드된 사진이 없습니다.</p>}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-40 transition-opacity duration-300 ease-in-out"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full mx-4 bg-white rounded-lg shadow-2xl overflow-hidden "
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-800 text-2xl font-bold z-10 hover:text-red-500 transition-colors duration-200"
              onClick={() => setSelectedImage(null)}
            >
              ✖
            </button>
            <img
              src={selectedImage}
              alt="선택된 이미지"
              className="w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}


    </>
  );
};

export default PhotoGallery;
