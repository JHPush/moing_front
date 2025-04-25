import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import moimRouter from "./moingRouter";


const Loading = <div>Loading....</div>
const Main = lazy(() => import("../pages/MainPage"))
const ChatMessage = lazy(() => import ("../components/Message/ChatMessage"))
const CreateMoimPage = lazy(()=>import("../pages/CreateMoimPage"))
const LoginPage = lazy(() => import("../components/menus/LoginPage"));
const SignupPage = lazy(() => import("../components/menus/SignupPage"));
const MoimPage = lazy(()=>import("../pages/MoimPage"))
const InviteMoim = lazy(() => import("../components/moim/InviteMoim"));
const Notification =lazy(() => import("../components/Notify/NotifyComponent"));

const root = createBrowserRouter([

  {
    path: "/login",
    element: <Suspense fallback={Loading}><LoginPage /></Suspense>,
  },
  {
    path: "/signup",
    element: <Suspense fallback={Loading}><SignupPage /></Suspense>,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
  {
    path: "/",
    element: <Suspense fallback={Loading}><Main/></Suspense>
  },
  {
    path: "chat/:gatheringId",
    element: <Suspense fallback={Loading}><ChatMessage/></Suspense>
  },
  {

    path: "/create-moim",
    element: <Suspense fallback={Loading}><CreateMoimPage/></Suspense>
  },
  {
    path: "/moim/:moimid",
    element: <Suspense fallback={Loading}><MoimPage/></Suspense>,
    children: moimRouter()
  },
  {
    path: "/invite-moim",
    element: <Suspense fallback={Loading}><InviteMoim/></Suspense>
  },
  {
    path: "/notification",
    element: <Suspense fallback={Loading}><Notification/></Suspense>
  }



])

export default root;
