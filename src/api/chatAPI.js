import axios from "axios"

const PREFIX_URL = 'https://ardbyd7sf7.execute-api.ap-northeast-2.amazonaws.com/dev/'


//처음메세지 로드
export const loadInitialMessages = async (gatheringId, limit = 20)=>{
    const res = await axios.get(`${PREFIX_URL}/moing/chats/${gatheringId}?limit=${limit}`);
    console.log("res:", res)
    return res;
}

// 이전 메시지 로드 (무한 스크롤용)
export const loadPreviousMessages = async (gatheringId, beforeRegDate, limit = 20) => {
    const res = await axios.get(
        `${PREFIX_URL}/moing/chats/${gatheringId}?beforeRegDate=${beforeRegDate}&limit=${limit}`
    );
    console.log("이전 메시지 응답:", res);
    return res;
}


