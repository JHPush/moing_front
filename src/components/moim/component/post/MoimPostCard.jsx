const MoimPostCard = ({ post, onSelectPost }) => {
    const isSchedule = post.post_type === 'Scheduled';

    return (
        <div
            className="bg-white rounded-2xl shadow-md p-4 space-y-3 hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => onSelectPost?.(post)}
        >
            {/* 제목 */}
            <h3 className="text-lg font-semibold text-gray-800 truncate">
                {post.title}
            </h3>

            {/* 모임 일정 안내 (있을 때만) */}
            {isSchedule && (
                <div className="bg-blue-50 border border-blue-200 rounded-md px-3 py-2 text-sm text-blue-700">
                    <p className="font-semibold">📅 모임이 있습니다!</p>
                    <p className="mt-1">일자: <span className="font-medium">{post.schedule}</span></p>
                    <p className="mt-1">장소: <span className="font-medium">{post.moim_addr}</span></p>
                </div>
            )}

            {/* 내용 */}
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {post.content}
            </p>

            {/* 작성 정보 */}
            <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                <p>✍️ 작성자: {post.member_name}</p>
                <p>🕒 작성일: {post.reg_date}</p>
            </div>
        </div>
    );
};

export default MoimPostCard;
