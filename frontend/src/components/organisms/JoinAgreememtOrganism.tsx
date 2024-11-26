import React, { useState } from "react";
import LargeAbleButton from "../atoms/Button/LargeAbleButton";
import LargeDisableButton from "../atoms/Button/LargeDisableButton";
import { useNavigate } from "react-router";

const JoinAgreementOrganism: React.FC = () => {
    const [allChecked, setAllChecked] = useState(false);
    const [agreement1, setAgreement1] = useState(false);
    const [agreement2, setAgreement2] = useState(false);

    const navigate = useNavigate()

    const handleAllCheckedChange = () => {
        const newCheckedStatus = !allChecked;
        setAllChecked(newCheckedStatus);
        setAgreement1(newCheckedStatus);
        setAgreement2(newCheckedStatus);
    };

    const handleIndividualChange = (setAgreement: React.Dispatch<React.SetStateAction<boolean>>, value: boolean) => {
        setAgreement(value);
        if (!value) {
            setAllChecked(false);
        } else {
            if ((setAgreement === setAgreement1 && agreement2) || (setAgreement === setAgreement2 && agreement1)) {
                setAllChecked(true);
            }
        }
    };

    const clickNextBtn = () => {
        navigate('/join')
    }
    const isAllAgreed = agreement1 && agreement2;

    return (
        <>
            <div className="text-[#2B2F40] text-3xl font-black mt-6 ms-2">
                서비스 가입
            </div>
            <div className="text-[#2B2F40] text-normal font-light mt-4 mr-20 ms-1">
                서비스 시작 및 가입을 위해 먼저 가입 및 정보 제공에 동의해주세요.
            </div>

            {/* 약관 전체 동의 */}
            <div className="inline-flex items-center mt-16 mx-2">
                <label
                    className="relative flex cursor-pointer items-center rounded-full"
                    htmlFor="allAgreement"
                >
                    <input
                        id="allAgreement"
                        type="checkbox"
                        checked={allChecked}
                        onChange={handleAllCheckedChange}
                        className="peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all checked:bg-[#2B2F40] focus:ring-[#2B2F40]"
                    />
                    <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            viewBox="0 0 20 20"
                            fill="white"
                            stroke="white"
                            strokeWidth="1"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </label>
                <span
                    className="cursor-pointer select-none font-bold text-lg text-[#2B2F40] ms-2"
                    onClick={handleAllCheckedChange}
                >
                    약관 전체 동의
                </span>
            </div>
            <hr className="my-4" />

            {/* 첫 번째 약관동의 리스트 */}
            <div className="inline-flex items-center mb-4 mx-2">
                <label
                    className="relative flex cursor-pointer items-center rounded-full"
                    htmlFor="agreement1"
                >
                    <input
                        id="agreement1"
                        type="checkbox"
                        checked={agreement1}
                        onChange={(e) => handleIndividualChange(setAgreement1, e.target.checked)}
                        className="peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all checked:bg-[#2B2F40] focus:ring-[#2B2F40]"
                    />
                    <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            viewBox="0 0 20 20"
                            fill="white"
                            stroke="white"
                            strokeWidth="1"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </label>
                <a
                    onClick={() => window.open("https://plip.kr/pcc/c4e5d64b-b622-4e9b-8aea-3ff090130a30/privacy/2.html", "_blank")}
                    className="mt-px cursor-pointer select-none font-light text-[#2B2F40] underline ms-2"
                >
                    CREW-IN 개인정보 처리 방침 (필수)
                </a>
            </div>

            {/* 두 번째 약관동의 리스트 */}
            <div className="inline-flex items-center mx-2">
                <label
                    className="relative flex cursor-pointer items-center rounded-full"
                    htmlFor="agreement2"
                >
                    <input
                        id="agreement2"
                        type="checkbox"
                        checked={agreement2}
                        onChange={(e) => handleIndividualChange(setAgreement2, e.target.checked)}
                        className="peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all checked:bg-[#2B2F40] focus:ring-[#2B2F40]"
                    />
                    <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            viewBox="0 0 20 20"
                            fill="white"
                            stroke="white"
                            strokeWidth="1"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </label>
                <a
                    onClick={() => window.open("https://plip.kr/pcc/c4e5d64b-b622-4e9b-8aea-3ff090130a30/consent/2.html", "_blank")}
                    className="cursor-pointer select-none font-light text-[#2B2F40] underline me-16 ms-2"
                >
                    위치정보 수집 및 이용 동의서 (필수)
                </a>
            </div>

            {/* 버튼 렌더링 */}
            <div className="mt-6">
                {isAllAgreed ? (
                    <LargeAbleButton text="다음" onClick={clickNextBtn} />
                ) : (
                    <LargeDisableButton text="다음" />
                )}
            </div>
        </>
    );
};

export default JoinAgreementOrganism;
