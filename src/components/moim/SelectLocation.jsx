import { useState } from "react";
import { hangjungdong } from "../../assets/data/hangjungdong"

const SelectLocation = ({ onClose, onSave }) => {
    const [val1, setVal1] = useState("");
    const [val2, setVal2] = useState("");
    const [val3, setVal3] = useState("");
    const { sido, sigugun, dong } = hangjungdong;
    // console.log(hangjungdong)
    const handleSave = () => {
        const selectedRegion = [val1, val2, val3];  // 문자열로 조합
        onSave(selectedRegion);  // 부모에 전달!
    };
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl">
                <h2 className="text-xl font-bold text-gray-800 mb-6">📍 지역 선택</h2>

                {/* 셀렉트박스들 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {/* 시/도 */}
                    <select
                        onChange={(e) => setVal1(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        <option value="">시/도 선택</option>
                        {sido.map((el) => (
                            <option key={el.sido} value={el.sido}>
                                {el.codeNm}
                            </option>
                        ))}
                    </select>

                    {/* 시/군/구 */}
                    <select
                        onChange={(e) => setVal2(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        <option value="">시/군/구 선택</option>
                        {sigugun
                            .filter((el) => el.sido === val1)
                            .map((el) => (
                                <option key={el.sigugun} value={el.sigugun}>
                                    {el.codeNm}
                                </option>
                            ))}
                    </select>

                    {/* 동/읍/면 */}
                    <select
                        onChange={(e) => setVal3(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        <option value="">동/읍/면 선택</option>
                        {dong
                            .filter((el) => el.sido === val1 && el.sigugun === val2)
                            .map((el) => (
                                <option key={el.dong} value={el.dong}>
                                    {el.codeNm}
                                </option>
                            ))}
                    </select>
                </div>

                {/* 버튼 */}
                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                        onClick={onClose}
                    >
                        취소
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        onClick={handleSave}
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );

}
export default SelectLocation