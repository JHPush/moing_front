

const MoimRecentPostCard = () => {
    return (
        <aside className="col-span-1 space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold mb-1">최근 모임 공지</h3>
                <p className="text-sm text-gray-700">
                    📅 05.10 정기 모임 공지 - 강남역 근처에서 예정되어 있습니다. 자세한 위치와 멤버들은 곧 안내드릴게요.
                </p>
                <div className="text-xs text-blue-500 cursor-pointer mt-2">Show more</div>
            </div>
        </aside>
    )
}

export default MoimRecentPostCard