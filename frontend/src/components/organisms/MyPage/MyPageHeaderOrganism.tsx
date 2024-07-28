import React from "react";
import ProfileImageComponent from "../../atoms/ImageSize/ProfileImageComponent";
import BarTitle from "../../atoms/Title/BarTitle";
import BarContent from "../../atoms/Content/BarContent";
import logo from "../../../assets/images/crewinlogo.png";

const MyPageHeaderOrganism: React.FC = () => {
  const userNickName = "달리는 효징";
  const username = "박효진";
  return (
    <>
      <div className="flex items-center w-full mb-4">
        <ProfileImageComponent src={logo} />
        <div className="flex flex-col w-1/3">
          <BarTitle title={userNickName} />
          <BarContent content={username} />
        </div>
        <div className="flex w-full">
          {/* 참가 횟수 */}
          <div className="flex flex-col items-center w-1/3">
            <span className="text-lg font-bold">
              10<span className="text-xs">회</span>
            </span>
            <span className="text-xs">참가 횟수</span>
          </div>
          {/* 누적 시간 */}
          <div className="flex flex-col items-center w-1/3">
            <span className="text-lg font-bold">
              50<span className="text-xs">h</span>
            </span>
            <span className="text-xs">누적 시간</span>
          </div>
          {/* 누적 km */}
          <div className="flex flex-col items-center w-1/3">
            <span className="text-lg font-bold">
              200<span className="text-xs">km</span>
            </span>
            <span className="text-xs">누적 거리</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyPageHeaderOrganism;
