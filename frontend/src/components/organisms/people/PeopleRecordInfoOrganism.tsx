import React from "react";
import MyPageProfileImage from "../../atoms/ImageSize/MyPageProfileImageComponent";
import BarTitle from "../../atoms/Title/BarTitle";
import BarContent from "../../atoms/Content/BarContent";
import { ProfileDto } from "../../../apis/api/mypage";

type FetchDataProps = {
  profileData: ProfileDto;
};

const PeopleRecordInfoOrganism: React.FC<FetchDataProps> = ({
  profileData,
}) => {
  const {
    nickname,
    totalDistance,
    totalTime,
    totalAttendance,
    imageUrl,
    name,
  } = profileData;

  return (
    <>
      <div className="flex items-center flex-col w-full my-4">
        <MyPageProfileImage src={imageUrl} editable={false} />
        <BarTitle title={nickname} />
        <BarContent content={name} />
        <div className="flex w-full justify-evenly py-2">
          {/* 참가 횟수 */}
          <div className="flex flex-col items-center w-1/4">
            <span className="text-xl font-bold ">
              {totalAttendance}
              <span className="text-xs font-bold">회</span>
            </span>
            <span className="text-xs font-normal text-gray-400">참가 횟수</span>
          </div>
          {/* 누적 시간 */}
          <div className="flex flex-col items-center w-1/4">
            <span className="text-xl font-bold">
              {totalTime}
              <span className="text-xs font-bold">h</span>
            </span>
            <span className="text-xs font-normal text-gray-400">누적 시간</span>
          </div>
          {/* 누적 km */}
          <div className="flex flex-col items-center w-1/4">
            <span className="text-xl font-bold">
              {totalDistance}
              <span className="text-xs font-bold">km</span>
            </span>
            <span className="text-xs font-normal text-gray-400">누적 거리</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PeopleRecordInfoOrganism;
