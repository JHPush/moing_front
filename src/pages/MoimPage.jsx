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
    const [posts, setPosts] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [files, setFiles] = useState({ allPresignedImg: [] });

    const updateFiles = (newPresignedImg) => {
        setFiles(prevFiles => ({
            ...prevFiles,
            allPresignedImg: [...prevFiles.allPresignedImg, ...newPresignedImg]
        }));
    };

    const getMoimPosts = async (id) => {
        try {
            const postRes = JSON.parse(await getAllPostByMoimId(id));
            const postImgRes = JSON.parse(await getAllPostImages(id, 'moim-post-images'));
            let allPresignedImg = [];

            const newPosts = postRes.map(post => {
                const matchingImages = postImgRes.filter(img => img.post_id === post.id);
                const urls = matchingImages.flatMap(obj => obj.files.map(temp => temp.presigned_url));
                allPresignedImg.push(...urls);

                return {
                    ...post,
                    files: matchingImages.length > 0 ? matchingImages[0].files : []
                };
            });
            setPosts(newPosts);
            updateFiles(allPresignedImg);
        } catch (error) {
            console.error("오류 발생:", error);
        }
    };

    const handlePostCreated = () => {
        setReloadTrigger(prev => !prev);
    };

    useEffect(() => {
        if (moim.name === '') {
            getMoim(id, category)
                .then(data => {
                    const temp = JSON.parse(data.body);
                    setMoim(temp);
                    getMoimPosts(temp.id);
                })
                .catch(e => console.error("getMoim() 오류:", e));
        }
    }, [id]);

    useEffect(() => {
        getMoimPosts(id);
    }, [id, reloadTrigger]); 

    return (
        <BasicLayout>
            {user && user.gatherings.includes(moim.id) ? (
                <MoimMainLayout moim={moim} user={user} posts={posts} files={files} handlePostCreated={handlePostCreated} />
            ) : (
                <IntroductionMoim moim={moim} user={user} />
            )}
        </BasicLayout>
    );
};

export default MoimPage;