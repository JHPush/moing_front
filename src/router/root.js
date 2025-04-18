import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

const Loading = <div>Loading....</div>;

const MainPage = lazy(() => import("../pages/MainPage"));
const LoginPage = lazy(() => import("../components/menus/LoginPage"));
const SignupPage = lazy(() => import("../components/menus/SignupPage"));

const root = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={Loading}><MainPage /></Suspense>,
  },
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
]);

export default root;
