import { Suspense, lazy } from "react";

const { createBrowserRouter } = require("react-router-dom");

const Loading = <div>Loading....</div>
const Main = lazy(() => import("../pages/MainPage"))
const CreateMoimPage = lazy(()=>import("../pages/CreateMoimPage"))
const IntroductionMoimPage = lazy(()=>import("../pages/IntroductionMoimPage"))


const root = createBrowserRouter([

  {
    path: "",
    element: <Suspense fallback={Loading}><Main/></Suspense>
  },
  {
    path: "/create-moim",
    element: <Suspense fallback={Loading}><CreateMoimPage/></Suspense>
  },
  {
    path: "/introduct-moim",
    element: <Suspense fallback={Loading}><IntroductionMoimPage/></Suspense>
  }



])

export default root;
