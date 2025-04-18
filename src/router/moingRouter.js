import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div>Loading...</div>
const MoingDetail = lazy(()=>import("../components/moim/IntroductionMoim"))

const moimRouter = ()=>{
    return[

    ]
}
export default moimRouter