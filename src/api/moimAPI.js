import axios from "axios"

const MOING_API_URL = 'https://4nfxslyaig.execute-api.ap-northeast-2.amazonaws.com/dev/moing'

export const getPresignedURL = async (name, type)=>{
    console.log(`${MOING_API_URL}`, {
        params: {
          filename: name,
          filetype: type
        }
      });

    return (await axios.get(`${MOING_API_URL}`, {params:{
        'filename': name,
        'filetype': type
    }})).data.body;
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
    return (await axios.post(`${MOING_API_URL}`, form, {headers})).data;
}