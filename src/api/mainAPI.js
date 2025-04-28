import axios from "axios"

const PREFIX_URL = process.env.REACT_APP_PREFIX_URL

export const getAllGroup = async (category) => {
    const res = await axios.get(`${PREFIX_URL}/moing/groups`, { params: { category } });
    return res.data.body;
}

export const getMyGroup = async (userId) => {
    const res = await axios.get(`${PREFIX_URL}/moing/groups/mine`, { params: { userId } });
    return res;
}

export const getNearbyGroup = async (latitude, longitude) => {
    const response = await axios.post(`${PREFIX_URL}/moing/groups/mine`, {
        latitude,
        longitude
    })
    return response;
}

export const getSearchGroup = async (mappedKeywords) => {
    const res = await axios.get(`${PREFIX_URL}/moing/groups/search?keyword=${encodeURIComponent(mappedKeywords)}`)
    return res;
}
