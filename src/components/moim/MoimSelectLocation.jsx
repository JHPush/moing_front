import { useState } from "react";
import { searchLocationApi } from "../../api/moimAPI";

const SelectLocation = ({ onClose, onSave }) => {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState([]);

    const searchLocation= ()=>{
        searchLocationApi(keyword).then(data=>{
            console.log(data)
            setResults(data);
        }).catch(e=>{
            console.log('error : ', e)
        })
    }

    const handleSelect = (place) => {
        onSave(place); // 혹은 place.address_name 등
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl">
                <h2 className="text-xl font-bold text-gray-800 mb-4">📍 지역 검색</h2>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        className="flex-1 p-2 border rounded-lg"
                        placeholder="지역명 입력"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button
                        onClick={searchLocation}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        검색
                    </button>
                </div>

                <ul className="max-h-60 overflow-y-auto">
                    {results&& results.map((place, i) => (
                        <li
                            key={i}
                            className="p-3 border-b cursor-pointer hover:bg-blue-50 rounded-md"
                            onClick={() => handleSelect(place)}
                        >
                            <p className="font-semibold text-gray-800">{place.place_name}</p>
                            <p className="text-sm text-gray-500">{place.address_name}</p>
                        </li>
                    ))}
                </ul>

                <div className="mt-6 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectLocation;
