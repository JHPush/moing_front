import axios from "axios"

const PREFIX_URL = 'https://ardbyd7sf7.execute-api.ap-northeast-2.amazonaws.com/dev/moing'

export const getNotify = async (userId)=>{
    const res = await axios.get(`${PREFIX_URL}/notify`, { params: { userId } });
    return res;
}

export const changeIsRead = async (id, post_id) =>{
    const res = await axios.post(`${PREFIX_URL}/notify`, {  
        id: id, 
        post_id: post_id 
    } ,{
        headers: {
          'Content-Type': 'application/json',
        }
      });
    return res;
}
