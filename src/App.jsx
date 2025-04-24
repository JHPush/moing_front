import {RouterProvider} from "react-router-dom";
import root from "./router/root";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadUserFromCookies } from "./utils/cookieUtils";
import { setUser } from "./store/userSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = loadUserFromCookies();
    if (savedUser) {
      dispatch(setUser(savedUser));
    }
  }, []);
  return (
    <WebSocketProvider>
    <RouterProvider router={root}/>
    </WebSocketProvider>
  );
}

export default App;
