import axios from "axios"

const PREFIX_URL = 'https://ardbyd7sf7.execute-api.ap-northeast-2.amazonaws.com/dev/'


//처음메세지 로드 (limit =8)
export const loadInitialMessages = async (gatheringId)=>{
    const res = await axios.get(`${PREFIX_URL}/moing/chats/${gatheringId}`);
    console.log("res:", res)
    return res;
}

//이전메세지 추가 로드
// export const loadOlderMessages = async(gatheringId, lastRegDate) =>{
//     const res = await fetch(`${PREFIX_URL}/chats/${gatheringId}?last_reg_date=${lastRegDate}`);
//     console.log("res:", res)
//     return res
// }

