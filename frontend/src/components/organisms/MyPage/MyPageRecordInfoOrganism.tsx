import React from "react";
import MyPageProfileImage from "../../atoms/ImageSize/MyPageProfileImageComponent";
import BarTitle from "../../atoms/Title/BarTitle";
import BarContent from "../../atoms/Content/BarContent";
import logo from "../../../assets/images/crewinlogo.png";

const MyPageRecordInfoOrganism: React.FC = () => {
  const userNickName = "달리는 효징";
  const username = "박효진";
  return (
    <>
      <div className="flex items-center flex-col w-full my-4">
        <MyPageProfileImage src={logo} />
        <BarTitle title={userNickName} />
        <BarContent content={username} />
        <div className="flex w-full justify-evenly py-2">
          {/* 참가 횟수 */}
          <div className="flex flex-col items-center w-1/4">
            <span className="text-xl font-bold ">
              10<span className="text-xs font-bold">회</span>
            </span>
            <span className="text-xs font-bold">참가 횟수</span>
          </div>
          {/* 누적 시간 */}
          <div className="flex flex-col items-center w-1/4">
            <span className="text-xl font-bold">
              50<span className="text-xs font-bold">h</span>
            </span>
            <span className="text-xs font-bold">누적 시간</span>
          </div>
          {/* 누적 km */}
          <div className="flex flex-col items-center w-1/4">
            <span className="text-xl font-bold">
              200<span className="text-xs font-bold">km</span>
            </span>
            <span className="text-xs font-bold">누적 거리</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyPageRecordInfoOrganism;
