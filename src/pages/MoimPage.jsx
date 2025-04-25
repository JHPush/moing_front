import { useLocation } from "react-router-dom";
import BasicLayout from "../layouts/BasicLayout";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import IntroductionMoim from "../components/moim/IntroductionMoim";
import { getAllPostByMoimId, getAllPostImages, getMoim } from "../api/moimAPI";
import MoimMainLayout from "../components/moim/MoimMainLayout";

const initMoimForm = {
    owner_id: '',
    name: '',
    file_url: '',
    introduction_content: '',
    category: '',
    region: '',
    snapshot: ''
};

const MoimPage = () => {
    const user = useSelector(state => state.user.user);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('moimid');
    const category = searchParams.get('category');

    const [moim, setMoim] = useState({ ...initMoimForm });
    
    useEffect(() => {
        if (moim.name === '') {
            getMoim(id, category)
                .then(data => {
                    const temp = JSON.parse(data.body);
                    setMoim(temp);
                })
                .catch(e => console.error("getMoim() 오류:", e));
        }
    }, [id]);

    return (
        <BasicLayout>
            {user && user.gatherings.includes(moim.id) ? (
                <MoimMainLayout moim={moim} user={user}  />
            ) : (
                <IntroductionMoim moim={moim} user={user} />
            )}
        </BasicLayout>
    );
};

export default MoimPage;