import { Suspense, lazy } from "react";

const { createBrowserRouter } = require("react-router-dom");

const Loading = <div>Loading....</div>
const Main = lazy(() => import("../pages/MainPage"))
const ChatMessage = lazy(() => import ("../components/Message/ChatMessage"))


const root = createBrowserRouter([

  {
    path: "",
    element: <Suspense fallback={Loading}><Main/></Suspense>
  },
  {
    path: "chat/:gatheringId",
    element: <Suspense fallback={Loading}><ChatMessage/></Suspense>
  },



])

export default root;
