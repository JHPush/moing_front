import axios from "axios"

const PREFIX_URL = 'https://ardbyd7sf7.execute-api.ap-northeast-2.amazonaws.com/dev'
const MOING_API_URL = '/moing/detail'
const MOING_JOIN_URI = '/join'
const MOING_POST_URI = '/post'
const MOING_EXIT_URI = '/exit'
const MOING_PAGE_POST_URI = '/post/page'
const MOING_GET_IMAGES_URI = '/post/images'
const MOIMG_GET_SCHEDULED_URI = '/post/scheduled'
const MOING_PRESIGN_URL_PUT = '/sequre/puts'
const MOING_PRESIGN_URL_GET = '/sequre/gets'
const MOING_POST_PRESIGN_URL_POST = '/sequre/post'

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

export const getScheduledPostByMoim = async (moim_id)=>{
    return (await axios.get(`${PREFIX_URL + MOING_API_URL + MOIMG_GET_SCHEDULED_URI}`, {params: {'moim_id' : moim_id}})).data
}


export const getPresignedURL_PostPut = async (urls) => {
    return (await axios.post(`${PREFIX_URL + MOING_POST_PRESIGN_URL_POST}`, urls, {
        headers: {
            'Content-Type': 'application/json'
        },
    }));
}
export const putExitMoim = async (moimid, moimcategory, userid)=>{
    return (await axios.put(`${PREFIX_URL + MOING_API_URL + MOING_EXIT_URI}`
            , { moimid: moimid, moimcategory: moimcategory, userid: userid },
            { headers: { 'Content-Type': 'application/json' } })).data;
}

export const getAllPostImages = async (moim_id, bucketName) => {
    return (await axios.get(`${PREFIX_URL + MOING_API_URL + MOING_GET_IMAGES_URI}`, { params: { 'moim_id': moim_id, 'bucket': bucketName } })).data.body
}

export const getAllPostByMoimId = async (moim_id) => {
    return (await axios.get(`${PREFIX_URL + MOING_API_URL + MOING_POST_URI}`, { params: { 'moim_id': moim_id } })).data.body
}
export const postPagePostByMoimId = async (moim_id, limit, key = null) => {
    const body = {
        moim_id,
        limit,
        ...(key && { exclusive_start_key: key })
    };

    return (await axios.post(`${PREFIX_URL + MOING_API_URL + MOING_PAGE_POST_URI}`, body)).data.body;
};


export const getPresignedURL_get = async (fileurl, bucketName) => {
    return (await axios.get(`${PREFIX_URL + MOING_PRESIGN_URL_GET}`, { params: { 'fileurl': fileurl, 'bucket': bucketName } })).data;
}

export const getMoimImageByPresignedUrl = async (url) => {
    return (await axios.get(url, { responseType: 'blob' })).data;
}

export const getMoim = async (id, category) => {
    return (await axios.get(`${PREFIX_URL + MOING_API_URL}`, { params: { 'id': id, 'category': category } })).data;
}
export const putJoinMoim = async (moimId, moimCategory, userId) => {
    return (await axios.put(`${PREFIX_URL + MOING_API_URL + MOING_JOIN_URI}`,
        { moimid: moimId, moimcategory: moimCategory, userid: userId },
        { headers: { 'Content-Type': 'application/json' } })).data;
};


export const putUploadMoimImageByPresignedUrl = async (url, file) => {
    return (await axios.put(`${url}`, file, {
        headers: {
            'Content-Type': file.type || 'application/octet-stream',
        },
    }));
}

export const postCreateMoing = async (form) => {
    const headers = { 'Content-Type': 'application/json' };
    return (await axios.post(`${PREFIX_URL + MOING_API_URL}`, form, { headers })).data;
}


export const postMoimPost = async (form) => {
    console.log('form : ', form)
    const headers = { 'Content-Type': 'application/json' }
    return (await axios.post(`${PREFIX_URL + MOING_API_URL + MOING_POST_URI}`, form, { headers })).data
}

export const deleteMoimPost = async (form) => {
    console.log('api del : ', form)
    const headers = { 'Content-Type': 'application/json' }
    return (await axios.delete(`${PREFIX_URL + MOING_API_URL + MOING_POST_URI}`, { data: form, headers })).data
}


export const updateMoimPost = async (form) => {
    console.log('api upd : ', form)

    const headers = { 'Content-Type': 'application/json' }
    return (await axios.put(`${PREFIX_URL + MOING_API_URL + MOING_POST_URI}`, form, { headers })).data
}

export const getInvitation = async (moimid, category)=>{
    console.log("category:", category)
    const response = await axios.get(`${PREFIX_URL+MOING_API_URL}/invitation`, {params:{'moimid': moimid,'category': category}}) 
    
    console.log('response:', response)
    return response.data.body;
}

export const postSendEmail = async (moimid, category, email, nickname)=>{
    const response = await axios.post(`${PREFIX_URL + MOING_API_URL}/invitation`, {
        moimid: moimid,
        category: category,
        email: email,
        nickname: nickname
      }, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    console.log('response:', response)

    return response;
}

export const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);

        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}

export const searchLocationApi = async (keyword) => {
    if (!keyword.trim()) return;

    const res = await axios.get(`https://dapi.kakao.com/v2/local/search/keyword.json`, {
        params: {
            query: keyword
        },
        headers: {
            Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`, // 환경변수로 API 키 설정
        }
    }
    )
    return res.data.documents
}

export const getMoimMembers = async (moimId) => {
    const res = await axios.get(`${PREFIX_URL + MOING_API_URL}/${moimId}/members`);
    console.log("res : ", res);
    return res.data;
};

export const getPendingMembers = async (moimId) => {
    const res = await axios.get(`${PREFIX_URL + MOING_API_URL}/${moimId}/pending-members`);
    console.log("res.data.pendingMembers : ", res.data.pendingMembers);
    return res.data;
  };

export const postApplyMoim = async (userId, moimId, category) => {
    return await axios.post(`${PREFIX_URL + MOING_API_URL + MOING_JOIN_URI}/apply`, {
        userId,
        moimId,
        category
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const approveMember = async (userId, moimId, category) => {
    return await axios.put(`${PREFIX_URL + MOING_API_URL}/approve-member`, {
      userId,
      moimId,
      category
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };
  