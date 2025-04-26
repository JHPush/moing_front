import React, { useEffect, useState } from "react";
import { getOnceRecentByScheduled } from "../../../../api/moimAPI";

const NoticeCard = ({ moim }) => {
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    if (notice || !moim.name) return
    getOnceRecentByScheduled(moim.id).then(data => {
      setNotice(JSON.parse(data.body)[0])
      console.log('data ', notice)
    }).catch(e => {
      console.error('error ', e)
    })
  }, [moim])

  useEffect(() => {
    console.log('notice : ', notice)
  }, [notice])


  return (
    <>
      {notice ?
        <div className="bg-white rounded-2xl shadow p-4 max-h-[250px]">
          <h2 className="text-lg font-semibold mb-2">최근 활동</h2>
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-gray-200 text-sm px-2 py-1 rounded">{notice.schedule}</div>
            <p className="text-sm text-gray-500">{notice.moim_addr}</p>
          </div>
          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
            <strong>{notice.schedule.split(' ')[0]} 모임 공지</strong><br />
            {notice.content}
          </ul>
          <button className="mt-4 text-blue-500 hover:underline text-sm" onClick={() => alert('모임에 가입해보세요!')}>Show more</button>
        </div>
        : 
        <div className="bg-white rounded-2xl shadow p-4 max-h-[250px]">
        <h2 className="text-lg font-semibold mb-2">최근 활동</h2>
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-gray-200 text-sm px-2 py-1 rounded">최근 활동 내역이 없습니다</div>
        </div>
      </div >}
    </>
  );
};

export default NoticeCard;