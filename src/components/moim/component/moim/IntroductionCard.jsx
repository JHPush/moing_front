import React, { useEffect, useState } from "react";
import { getSomeImagesByMoim } from "../../../../api/moimAPI";

const IntroductionCard = ({ moim }) => {
  const [images, setImages] = useState([])

  useEffect(() => {
    if (!moim || !moim.id) return
    console.log('moim ', moim)
    getSomeImagesByMoim(moim.id).then(data => {
      console.log(data)
      const temp = JSON.parse(data.body)
      console.log('imgs ', temp)
      setImages(JSON.parse(data.body))
    }).catch(e => {
      console.error('error ', e)
    })
  }, [moim])

  return (
    <div className="bg-white rounded-2xl shadow p-6 min-h-[460px] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">모임 소개</h2>
          <button className="text-gray-400 hover:text-gray-600 text-xl">⋯</button>
        </div>
        <div className="text-sm text-gray-700 leading-relaxed mb-4">
          {moim.introduction_content}
        </div>
        <hr className="my-4 border-gray-200" />
        <div className="flex flex-wrap gap-4 items-center justify-center py-6 bg-gray-100 rounded-lg shadow-md">
          {images&& images.presigned_urls && images.presigned_urls.length > 0 ? (
            images.presigned_urls.map((image, index) => (
              <div key={index} className="w-32 h-32 overflow-hidden rounded-lg border border-gray-300 shadow-sm">
                <img src={image} alt={`Uploaded ${index + 1}`} className="object-cover w-full h-full" />
              </div>
            ))
          ) : (
            <h2 className="text-lg font-semibold text-gray-600">아직 등록된 사진이 없네요</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntroductionCard;