import { useLocation } from "react-router-dom";
import BasicLayout from "../layouts/BasicLayout"
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import IntroductionMoim from "../components/moim/IntroductionMoim";
import { getAllPostByMoimId, getMoim } from "../api/moimAPI";
import MoimMainLayout from "../components/moim/MoimMainLayout";

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
    const [posts, setPosts] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false)

    const getMoimPosts = (id)=>{
        console.log('게시글 등록 : ', id)
        getAllPostByMoimId(id)
        .then((data) => {
            setPosts(JSON.parse(data));
        })
        .catch((e) => {
            console.log("error : ", e);
        });
    }
    const handlePostCreated = ()=>{
        setReloadTrigger(!reloadTrigger)
    }

    useEffect(() => {
        if (moim.name === '') {
            getMoim(id, category).then(data => {
                const temp = JSON.parse(data.body)
                setMoim(temp)
                getMoimPosts(temp.id)
            }).catch(e => {
                console.log('get moim error : ', e)
            })
        }
    }, [moim.id])

    useEffect(()=>{
        getMoimPosts(id)
    },[reloadTrigger])

    return (
        <BasicLayout>
            {user && user.gatherings.find(id => id === moim.id) ? <MoimMainLayout moim={moim} user={user} posts={posts} handlePostCreated={handlePostCreated} /> : <IntroductionMoim moim={moim} user={user} />}


            {/*  */}
        </BasicLayout>
    )
}

export default MoimPage