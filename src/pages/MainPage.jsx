import { useNavigate } from "react-router-dom";
import GroupView from "../components/Main/GroupView";
import BasicLayout from "../layouts/BasicLayout";
import { useEffect, useState } from "react";
import {updateUserInfo} from "../utils/updateUserInfo"
import { useDispatch, useSelector } from "react-redux";

const MainPage = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user)
  
  useEffect(()=>{
    if(user)
      updateUserInfo(dispatch,user.userId, user.idToken, user.accessToken)
  }, [])



  return (
    <BasicLayout>


      <GroupView />
    </BasicLayout>

  );
}

export default MainPage;
