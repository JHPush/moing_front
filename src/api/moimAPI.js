import axios from "axios"

const PREFIX_URL = 'https://ardbyd7sf7.execute-api.ap-northeast-2.amazonaws.com/dev'
const MOING_API_URL = '/moing/detail'
const MOING_PRESIGN_URL_PUT = '/sequre/puts'
const MOING_PRESIGN_URL_GET = '/sequre/gets'

export const getPresignedURL_put = async (name, type)=>{
    console.log(`${PREFIX_URL+MOING_PRESIGN_URL_PUT}`, {
        params: {
          filename: name,
          filetype: type
        }
      });

    return (await axios.get(`${PREFIX_URL+MOING_PRESIGN_URL_PUT}`, {params:{
        'filename': name,
        'filetype': type
    }})).data.body;
}
export const getPresignedURL_get = async (fileurl)=>{
    return (await axios.get(`${PREFIX_URL+MOING_PRESIGN_URL_GET}`, {params:{'fileurl':fileurl}})).data;
}


export const putUploadMoimProfile = async (url, file)=>{
    return (await axios.put(`${url}`, file, {
        headers: {
            'Content-Type': file.type || 'application/octet-stream', // 파일의 MIME 타입을 명시적으로 설정
        },
    }));
}

export const postCreateMoing = async(form)=>{
    const headers = {'Content-Type': 'application/json'};
    return (await axios.post(`${PREFIX_URL+MOING_API_URL}`, form, {headers})).data;
}