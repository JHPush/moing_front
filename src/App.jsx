import {RouterProvider} from "react-router-dom";
import root from "./router/root";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadUserFromCookies } from "./utils/cookieUtils";
import { setUser } from "./store/userSlice";

import { LoadingContext, useLoading } from './contexts/LoadingContext';
import GlobalLoading from './utils/GlobalLoading';
import { loadingController } from './utils/loadingController';

const GlobalLoaderBridge = () => {
    const { startLoading, stopLoading } = useLoading();
    loadingController.setHooks(startLoading, stopLoading);
    return null;
};

function App() {
  const dispatch = useDispatch();
  console.log("process.env.REACT_APP_PREFIX_URL : ", process.env.REACT_APP_PREFIX_URL);
  useEffect(() => {
    const savedUser = loadUserFromCookies();
    if (savedUser) {
      dispatch(setUser(savedUser));
    }
  }, []);
  return (
    <WebSocketProvider>
      <LoadingContext>
            <GlobalLoaderBridge /> {/* Axios와 연결 */}
            <GlobalLoading /> {/* 실제 로딩 표시 */}
            <RouterProvider router={root}/>
        </LoadingContext>
    </WebSocketProvider>
  );
}

export default App;
