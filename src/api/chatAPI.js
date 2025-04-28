import axios from "axios"

//처음메세지 로드
export const loadInitialMessages = async (gatheringId, limit = 20)=>{
    const res = await axios.get(`${process.env.REACT_APP_PREFIX_URL}/moing/chats/${gatheringId}?limit=${limit}`);
    console.log("res:", res)
    return res;
}

// 이전 메시지 로드 (무한 스크롤용)
export const loadPreviousMessages = async (gatheringId, beforeRegDate, limit = 20) => {
    const res = await axios.get(
        `${process.env.REACT_APP_PREFIX_URL}/moing/chats/${gatheringId}?beforeRegDate=${beforeRegDate}&limit=${limit}`
    );
    console.log("이전 메시지 응답:", res);
    return res;
}
