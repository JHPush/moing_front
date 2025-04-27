import React, { useEffect, useState } from 'react';
import { checkMoimName, getMoim, getPresignedURL_put, postCreateMoing, putUploadMoimImageByPresignedUrl } from '../../api/moimAPI';
import SelectLocation from './MoimSelectLocation';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { convertUrlToFile } from '../../utils/fileUtils';

const NAME_MIN_LENGTH = 1;
const NAME_MAX_LENGTH = 30;
const INTRO_MIN_LENGTH = 10;
const INTRO_MAX_LENGTH = 300;

const initMoimForm = {
    owner_id: '',
    name: '',
    short_description:'',
    introduction_content: '',
    category: '',
    region: '',
    // gender:'',
    // age:''
    snapshot: '',
    x: '',
    y: '',
    owner_nickname:''
}

const CreateMoim = () => {
    const nav = useNavigate();
    const user = useSelector(state => state.user.user)
    const [moim, setMoim] = useState({ ...initMoimForm });

    const [snapshots, setSnapshots] = useState([]);
    const [profile, setProfile] = useState(null)
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [nameError, setNameError] = useState('');

    const [nameCharCount, setNameCharCount] = useState(0);
    const [introCharCount, setIntroCharCount] = useState(0);
    const [isNameExceeded, setIsNameExceeded] = useState(false);
    const [isIntroExceeded, setIsIntroExceeded] = useState(false);
    const [isIntroTooShort, setIsIntroTooShort] = useState(true);

    useEffect(() => {
        setNameCharCount(moim.name.length);
        setIsNameExceeded(moim.name.length > NAME_MAX_LENGTH);
    }, [moim.name]);

    useEffect(() => {
        setIntroCharCount(moim.introduction_content.length);
        setIsIntroExceeded(moim.introduction_content.length > INTRO_MAX_LENGTH);
        setIsIntroTooShort(moim.introduction_content.length < INTRO_MIN_LENGTH);
    }, [moim.introduction_content]);

    const handleSelectLocation = (e) => {
        setMoim({ ...moim, ['region']: e.address_name, x: e.x, y: e.y })

        setShowLocationModal(false);
        console.log(moim)
    }

    const handleUpdateMoim = (e) => {
        setMoim({ ...moim, [e.target.name]: e.target.value })
    }

    const handleCreateMoing = async (e) => {
        let checkDouble = false
        if (user.gatherings.length >= 5) {
            alert(`최대 5개의 모임까지만 생성 가능합니다`)
            return;
        }
        if (moim.name.length === 0) {
            alert('모임 이름을 입력해주세요.');
            return;
        }

        if (moim.name.length > NAME_MAX_LENGTH) {
            alert(`모임 이름 글자수를 초과하였습니다. (현재: ${nameCharCount}자)`);
            return;
        }

        if (moim.introduction_content.length < INTRO_MIN_LENGTH) {
            alert(`모임 소개는 ${INTRO_MIN_LENGTH}자 이상 작성해주세요 (현재: ${introCharCount}자)`);
            return;
        }

        if (moim.introduction_content.length > INTRO_MAX_LENGTH) {
            alert(`모임 소개 글자수를 초과하였습니다. (현재: ${introCharCount}자)`);
            return;
        }

        if (moim.category === '' || moim.region === '' || profile === null) {
            console.log(moim);
            alert('모든 항목을 작성해주세요');
            return;
        }

        if (user == null) {
            alert('로그인 정보 없음, 다시 로그인하세요')
            nav('/', { replace: true })
            return
        }
        const res = await checkMoimName('moing.us-' + moim.name);
        if (res.statusCode !== 200) {
            setNameError('이미 사용 중인 모임 이름입니다.');
            return;
        } else {
            setNameError('');
        }
        try {
            const file = await convertUrlToFile(profile);
            const data = await getPresignedURL_put(file.name, file.type);
            const temp = JSON.parse(data);
            const fileUrl = temp.file_url;

            console.log('file url : ', fileUrl);

            const updateMoim = {
                ...moim,
                snapshot: fileUrl,
                owner_id: user.userId,
                owner_nickname: user.nickname
            };

            console.log(updateMoim);
            console.log("Request S3 Start !!");


            const postResult = await postCreateMoing(updateMoim);
            if (postResult.statusCode !== 200) {
                alert('모임 생성 실패');
                console.log(postResult);
                return;
            }

            console.log(postResult);
            await putUploadMoimImageByPresignedUrl(temp.upload_url, file);

            alert('모임 생성 완료!');

            nav('/', { replace: true });

        } catch (e) {
            console.error('모임 생성 중 오류 발생: ', e);
            alert('모임 생성 중 오류가 발생했습니다.');
        }


    }

    useEffect(() => {
        if (snapshots.length == 0) {
            const importAllProfile = (requiredContext => requiredContext.keys().map(requiredContext));
            setSnapshots(importAllProfile(require.context("../../assets/images/moim_default_profiles", false, /\.(png|jpg|gif)$/)));
        }
    }, [])


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-lg">
                {/* 모임 이름 */}
                <div className="mb-6">
                    <h2 className="text-left text-xl font-semibold text-gray-500 mb-4">모임 생성</h2>

                    <div className="relative">
                        <input
                            name='name'
                            className={`text-2xl font-bold w-full border-b focus:outline-none
                                ${nameError || isNameExceeded ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                            value={moim.name}
                            placeholder='모임 이름 입력'
                            onChange={(e) => {
                                handleUpdateMoim(e);
                                setNameError(''); // 입력 중에는 에러 초기화
                            }}
                            maxLength={NAME_MAX_LENGTH + 10} // 완전히 제한하지는 않지만 사용자에게 힌트 제공
                            autoFocus
                        />
                        <div className={`flex justify-end text-xs mt-1 ${isNameExceeded ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                            {nameCharCount}/{NAME_MAX_LENGTH}
                        </div>
                        {nameError && <p className="text-sm text-red-500 mt-1">{nameError}</p>}
                    </div>
                </div>

                {/* 이미지 선택 */}
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="flex-1 border border-dashed border-gray-300 rounded-xl h-64 flex items-center justify-center bg-gray-50 overflow-hidden">
                        {profile ? (
                            <img src={profile} alt="선택 이미지" className="object-contain h-full w-full rounded-xl" />
                        ) : (
                            <span className="text-gray-400">이미지를 선택하세요</span>
                        )}
                    </div>

                    <div className="flex-1">
                        <p className="mb-2 text-sm text-gray-700">모임 스냅샷 선택</p>
                        <div className="grid grid-cols-4 gap-2">
                            {/* 사진 추가 버튼 */}
                            <label className="border border-gray-300 rounded-lg h-20 flex items-center justify-center cursor-pointer hover:bg-gray-100">
                                📷
                                <input type="file" name='snapshot' className="hidden" onChange={(e) => setProfile(URL.createObjectURL(e.target.files[0]))} accept="image/*" />
                            </label>
                            {/* 썸네일 */}
                            {snapshots.slice(0, 7).map((src, i) => (
                                <div
                                    key={i}
                                    className={`border rounded-lg h-20 overflow-hidden cursor-pointer ${profile === src ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                    onClick={() => setProfile(src)}
                                >
                                    <img src={src} alt={`스냅샷 ${i + 1}`} className="h-full w-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* 한줄 설명 */}
                <div className="relative mb-6">
                    <input
                        name='short_description'
                        className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                        placeholder="모임을 한 줄로 소개해주세요"
                        onChange={handleUpdateMoim}
                        value={moim.short_description || ''}
                        maxLength={30}
                    />
                    <div className="flex justify-end text-xs mt-1 text-gray-500">
                        {(moim.short_description?.length || 0)}/30
                    </div>
                </div>


                {/* 설명 */}
                <div className="relative mb-6">
                    <textarea
                        name='introduction_content'
                        className={`w-full p-4 border rounded-xl resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-200
                            ${isIntroExceeded ? 'border-red-500' : isIntroTooShort ? 'border-yellow-500' : 'border-gray-300'}`}
                        placeholder="함께 하고 싶은 모임 활동을 자세히 소개해주세요 (10자 이상)"
                        onChange={handleUpdateMoim}
                        value={moim.introduction_content}
                        maxLength={INTRO_MAX_LENGTH + 10} // 완전히 제한하지는 않지만 사용자에게 힌트 제공
                    />
                    <div className={`flex justify-end text-xs mt-1 
                        ${isIntroExceeded ? 'text-red-500 font-medium' :
                            isIntroTooShort && introCharCount > 0 ? 'text-yellow-600 font-medium' :
                                'text-gray-500'}`}>
                        {introCharCount}/{INTRO_MAX_LENGTH}
                        {isIntroTooShort && introCharCount > 0 && (
                            <span className="ml-2">최소 {INTRO_MIN_LENGTH}자 필요</span>
                        )}
                    </div>
                </div>

                {/* 주제 선택 */}
                <div className="mb-10">
                    <h2 className="text-left text-xl font-semibold text-gray-800 mb-4">주제를 선택하세요</h2>

                    <div className="flex flex-wrap gap-3">
                        {['레저', '스포츠', '문화예술', '스터디', '음식', '취미'].map((item) => (
                            <button
                                key={item}
                                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 shadow-sm
                    ${moim.category === item
                                        ? 'bg-blue-600 text-white font-semibold'
                                        : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                                    }`}
                                onClick={() => setMoim({ ...moim, category: item })}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                </div>

                <hr className="my-6" />

                {/* 지역 선택 UI */}
                <div className="mb-10">
                    <h2 className="text-left text-xl font-semibold text-gray-800 mb-4">지역을 선택하세요</h2>
                    <button
                        className="px-5 py-3 rounded-full text-sm bg-green-100 text-green-800 font-medium hover:bg-green-200 transition-all duration-200 shadow-sm"
                        onClick={() => setShowLocationModal(true)}
                    >
                        지역 선택
                    </button>
                    {moim.region && (
                        <p className="mt-4 text-sm text-green-600 font-medium">{moim.region}</p>
                    )}
                </div>

                {/* 모달 컴포넌트 */}
                {showLocationModal && (
                    <SelectLocation
                        onClose={() => setShowLocationModal(false)}
                        onSave={handleSelectLocation}
                    />
                )}

                {/* 참여 제한 */}
                {/* <div className="mb-6">
                    <p className="mb-2 font-semibold text-gray-700">참여 제한</p>
                    <div className="flex gap-4 mb-3">
                        <select
                            name='gender'
                            className="p-2 border border-gray-300 rounded-lg"
                            value={moim.gender}
                            onChange={(e) => setMoim({...moim, [e.target.name]:[e.target.value]})}
                        >
                            <option value="">성별 무관</option>
                            <option value="남성만">남성만</option>
                            <option value="여성만">여성만</option>
                        </select>
                        <input
                            name='age'
                            type="number"
                            placeholder="나이 제한 (예: 20~30)"
                            value={moim.age}
                            onChange={(e) => setMoim({...moim, [e.target.name]:[e.target.value]})}
                            className="p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    {moim.gender || moim.age ? (
                        <p className="text-sm text-gray-600">
                            제한 조건: {moim.gender == ''? '성별 무관' : moim.gender }, {moim.age== ''? '나이 무관' : moim.age}
                        </p>
                    ) : null}
                </div> */}
                {/* <hr className="my-6" /> */}

                {/* 버튼 */}
                <div className="flex justify-between">
                    <button className="px-6 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">취소</button>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700" onClick={handleCreateMoing}>완료</button>
                </div>
            </div>
        </div>
    );
}

export default CreateMoim;