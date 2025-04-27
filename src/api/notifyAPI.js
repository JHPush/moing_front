import axios from "axios"

const PREFIX_URL = process.env.REACT_APP_PREFIX_URL

export const getNotify = async (userId)=>{
    const res = await axios.get(`${PREFIX_URL}/moing/notify`, { params: { userId } });
    return res;
}

export const changeIsRead = async (id, post_id) =>{
    const res = await axios.post(`${PREFIX_URL}/moing/notify`, {  
        id: id, 
        post_id: post_id 
    } ,{
        headers: {
          'Content-Type': 'application/json',
        }
      });
    return res;
}

// export const deleteNotify = async (gathering_id, userId, post_id)=>{
//   const res = await axios.delete(`${PREFIX_URL}/notify`, { params: { gathering_id, userId, post_id} });
//   return res;
// }


export const deleteNotify = async (gathering_id, userId, post_id) => {
  const res = await axios.delete(`${PREFIX_URL}moing/notify`, {
    data: { gathering_id, userId, post_id }, // ← 여기에 data로!
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res;
};

