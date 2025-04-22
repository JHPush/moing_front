const MoimRecentPostCard = ({ post, onSelectPost }) => {
    const truncateText = (text, limit) => {
        return text.length > limit ? text.slice(0, limit) + "..." : text;
    };

    return (
        post ? (
            <aside className="col-span-1 space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-1">최근 모임 공지</h3>
                    <p className="text-sm text-gray-700">📅 {post.schedule}</p>
                    <p className="text-sm text-gray-700 font-medium">{post.title}</p>
                    <p className="text-sm text-gray-700">{truncateText(post.content, 15)}</p>
                    <div className="text-xs text-blue-500 cursor-pointer mt-2" onClick={() => onSelectPost?.(post)}>
                        Show more
                    </div>
                </div>
            </aside>
        ) : <></>
    );
};

export default MoimRecentPostCard;