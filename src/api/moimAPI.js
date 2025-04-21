import axios from "axios"

const PREFIX_URL = 'https://ardbyd7sf7.execute-api.ap-northeast-2.amazonaws.com/dev'
const MOING_API_URL = '/moing/detail'
const MOING_JOIN_URI = '/join'
const MOING_POST_URI = '/post'
const MOING_PRESIGN_URL_PUT = '/sequre/puts'
const MOING_PRESIGN_URL_GET = '/sequre/gets'

export const getPresignedURL_put = async (name, type) => {
    console.log(`${PREFIX_URL + MOING_PRESIGN_URL_PUT}`, {
        params: {
            filename: name,
            filetype: type
        }
    });

    return (await axios.get(`${PREFIX_URL + MOING_PRESIGN_URL_PUT}`, {
        params: {
            'filename': name,
            'filetype': type
        }
    })).data.body;
}

export const getAllPostByMoimId = async(moim_id)=>{
    return (await axios.get(`${PREFIX_URL + MOING_API_URL + MOING_POST_URI}`, {params: {'moim_id' : moim_id}})).data.body
}

export const getPresignedURL_get = async (fileurl) => {
    return (await axios.get(`${PREFIX_URL + MOING_PRESIGN_URL_GET}`, { params: { 'fileurl': fileurl } })).data;
}

export const getMoimProfileImage = async (url) => {
    return (await axios.get(url, { responseType: 'blob' })).data;
}

export const getMoim = async (id, category) => {
    return (await axios.get(`${PREFIX_URL + MOING_API_URL}`, { params: { 'id': id, 'category': category } })).data;
}
export const putJoinMoim = async (moimId, moimCategory, userId) => {
    return ( await axios.put( `${PREFIX_URL + MOING_API_URL + MOING_JOIN_URI}`,
                                { moimid: moimId, moimcategory: moimCategory, userid: userId },
                                { headers: { 'Content-Type': 'application/json' } })).data;
};


export const putUploadMoimProfile = async (url, file) => {
    return (await axios.put(`${url}`, file, {
        headers: {
            'Content-Type': file.type || 'application/octet-stream', // 파일의 MIME 타입을 명시적으로 설정
        },
    }));
}

export const postCreateMoing = async (form) => {
    const headers = { 'Content-Type': 'application/json' };
    return (await axios.post(`${PREFIX_URL + MOING_API_URL}`, form, { headers })).data;
}


export const postMoimPost = async(form)=>{
    const headers = {'Content-Type': 'application/json'}
    return (await axios.post(`${PREFIX_URL + MOING_API_URL + MOING_POST_URI}`, form ,{headers})).data
}

export const deleteMoimPost = async(form)=>{
    console.log('api del : ', form)
    const headers = {'Content-Type': 'application/json'}
    return (await axios.delete(`${PREFIX_URL + MOING_API_URL + MOING_POST_URI}`, {data:form, headers})).data
}


export const updateMoimPost = async(form)=>{
    console.log('api upd : ', form)

    const headers = {'Content-Type': 'application/json'}
    return (await axios.put(`${PREFIX_URL + MOING_API_URL + MOING_POST_URI}`, form, {headers})).data
}