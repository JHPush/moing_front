import { useLocation } from "react-router-dom";
import MoimMain from "../components/moim/MoimMain"
import BasicLayout from "../layouts/BasicLayout"
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import IntroductionMoim from "../components/moim/IntroductionMoim";
import { getMoim } from "../api/moimAPI";

const initMoimForm = {
    owner_id: '',
    name: '',
    file_url: '',
    introduction_content: '',
    category: '',
    region: '',
    snapshot: ''
}

const MoimPage = () => {

    const user = useSelector(state => state.user.user)
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('moimid');
    const category = searchParams.get('category');
    const [moim, setMoim] = useState({ ...initMoimForm })

    useEffect(() => {
        if (moim.name === '') {
            getMoim(id, category).then(data => {
                setMoim(JSON.parse(data.body))
            }).catch(e => {
                console.log('get moim error : ', e)
            })
        }
    }, [])

        

    return (
        <BasicLayout>
            {user && user.gatherings.find(id=> id === moim.id)? <MoimMain moim={moim} user={user} />:<IntroductionMoim moim={moim} user={user} />}
            

            {/*  */}
        </BasicLayout>
    )
}

export default MoimPage