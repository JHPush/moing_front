import axios from "axios"

const PREFIX_URL = 'https://ardbyd7sf7.execute-api.ap-northeast-2.amazonaws.com/dev/moing'

export const getAllGroup = async (category)=>{
    const res = await axios.get(`${PREFIX_URL}/groups`, { params: { category } });
    return res.data.body;
}
export const getMyGroup = async (userId)=>{
    const res = await axios.get(`${PREFIX_URL}/groups/mine`,{params: {userId}});
    return res;
}