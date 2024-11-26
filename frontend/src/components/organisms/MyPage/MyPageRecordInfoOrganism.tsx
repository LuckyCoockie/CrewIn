import React, { useState } from "react";
import MyPageProfileImage from "../../atoms/ImageSize/MyPageProfileImageComponent";
import BarTitle from "../../atoms/Title/BarTitle";
import BarContent from "../../atoms/Content/BarContent";
import { ProfileDto } from "../../../apis/api/mypage";
import { EditProfileImageOrganism } from "../profile/EditProfileImageOrganism";
import ThemeToggle from "../../../util/theme/ToggleThemeButton";

type FetchDataProps = {
  profileData: ProfileDto;
  onProfileImageEdit: (
    { image }: { image?: File },
    onClose: () => void
  ) => Promise<void>;
};

const MyPageRecordInfoOrganism: React.FC<FetchDataProps> = ({
  profileData,
  onProfileImageEdit,
}) => {
  const {
    nickname,
    totalDistance,
    totalTime,
    totalAttendance,
    imageUrl,
    name,
  } = profileData;

  const [isEditProfileImageModalOpen, setIsEditProfileImageModalOpen] =
    useState(false);

  const handleOpenEditProfileImageModal = () => {
    setIsEditProfileImageModalOpen(true);
  };

  const handleCloseEditProfileImageModal = () => {
    setIsEditProfileImageModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center flex-col w-full my-4 relative">
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <ThemeToggle />
        </div>
        <MyPageProfileImage
          src={imageUrl}
          onClick={handleOpenEditProfileImageModal}
        />
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
      {isEditProfileImageModalOpen && (
        <EditProfileImageOrganism
          onClose={handleCloseEditProfileImageModal}
          onEdit={(image) =>
            onProfileImageEdit(image, handleCloseEditProfileImageModal)
          }
        />
      )}
    </>
  );
};

export default MyPageRecordInfoOrganism;
