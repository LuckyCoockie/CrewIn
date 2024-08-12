import React, { useState } from "react";
import { useQuery } from "react-query";
import NavTabMolecule from "../molecules/Tab/NavTabMolecule";
import MyPageRecordInfoOrganism from "../organisms/MyPage/MyPageRecordInfoOrganism";
import MyPageHeaderOrganism from "../organisms/MyPage/MyPageHeaderOrganism";
import MyPageMadeSessionOrganism from "../organisms/MyPage/MyPageMadeSessionOrganism";
import MyPageParticipatedSessionOrganism from "../organisms/MyPage/MyPageParticipatedSessionOrganism";
import MyPageMapOrganism from "../organisms/MyPage/MyPageMapOrganism";
import MyPageAlbumOrganism from "../organisms/MyPage/MyPageAlbumOrganism";
import {
  getMyProfileInfo,
  ProfileDto,
  getMyMaps,
  MyMapsDto,
  getMyMadeSessions,
  getMyParticipatedSessions,
  MyMadeSessionDto,
  MyParticipatedSessionDto,
} from "../../apis/api/mypage";
import { useNavigate } from "react-router";
import { createSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../modules";
import { uploadImage } from "../../apis/api/presigned";
import { editProfileImage } from "../../apis/api/profile";
import Modal from "../molecules/ModalMolecules";

const MyProfileTemplate: React.FC = () => {
  const navigate = useNavigate();

  console.log("여기는 내페이지");
  const [currentTab, setCurrentTab] = useState<string>("러닝 정보");
  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
  };

  const texts = ["러닝 정보", "사진첩"];
  const numericMemberId = null;
  const memberId = useSelector((state: RootState) => state.auth.memberId);

  // React Query를 사용하여 데이터를 한 번에 가져옴
  const {
    data: profileData,
    refetch: refetchProfileData,
    // isLoading: isProfileLoading,
    // isError: isProfileError,
  } = useQuery<ProfileDto>(["myProfile", numericMemberId], getMyProfileInfo);

  const {
    data: mapsData,
    isLoading: isMapsLoading,
    isError: isMapsError,
  } = useQuery<MyMapsDto[]>("myMaps", getMyMaps);

  const {
    data: madeSessions,
    isLoading: isMadeSessionsLoading,
    isError: isMadeSessionsError,
  } = useQuery<MyMadeSessionDto[]>(["myMadeSessions", 0], () =>
    getMyMadeSessions(0).then((res) => res.items)
  );

  const {
    data: participatedSessions,
    isLoading: isParticipatedSessionsLoading,
    isError: isParticipatedSessionsError,
  } = useQuery<MyParticipatedSessionDto[]>(["myParticipatedSessions", 0], () =>
    getMyParticipatedSessions(0).then((res) => res.items)
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const onProfileImageEdit = async (
    { image }: { image?: File },
    onClose: () => void
  ) => {
    try {
      const imageUrl = image ? await uploadImage(image) : undefined;
      if (imageUrl) {
        const imageDto = { profileImageUrl: imageUrl };
        await editProfileImage(imageDto);
        onClose(); // 성공적으로 변경 후 모달 닫기
        refetchProfileData();
      }
    } catch (error) {
      setModalMessage(
        "프로필 이미지 업로드에 실패했습니다. 잠시 후 다시 시도해주세요."
      );
      setIsModalOpen(true);
      console.error("프로필 이미지 업로드 에러:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <header>
        <MyPageHeaderOrganism />
      </header>
      {profileData && (
        <MyPageRecordInfoOrganism
          profileData={profileData!}
          onProfileImageEdit={onProfileImageEdit}
        />
      )}
      <NavTabMolecule
        texts={texts}
        onTabClick={handleTabClick}
        currentTab={currentTab}
      />
      {currentTab === "러닝 정보" ? (
        <>
          <div className="my-4">
            <MyPageMadeSessionOrganism
              sessions={madeSessions!}
              isMadeSessionsLoading={isMadeSessionsLoading}
              isMadeSessionsError={isMadeSessionsError}
            />
          </div>
          <div className="my-4">
            <MyPageParticipatedSessionOrganism
              sessions={participatedSessions!}
              isParticipatedSessionsLoading={isParticipatedSessionsLoading}
              isParticipatedSessionsError={isParticipatedSessionsError}
            />
          </div>
          <div className="my-4">
            <MyPageMapOrganism
              mapsData={mapsData!}
              isMapsLoading={isMapsLoading}
              isMapsError={isMapsError}
            />
          </div>
        </>
      ) : (
        <MyPageAlbumOrganism
          onItemClicked={async (pageNo, postId) =>
            navigate(
              `/profile/${memberId}/gallery?${createSearchParams({
                pageNo: pageNo.toString(),
                postId: postId.toString(),
              })}`
            )
          }
        />
      )}
      {isModalOpen && (
        <Modal title="오류" onClose={handleModalClose}>
          <p>{modalMessage}</p>
        </Modal>
      )}
    </>
  );
};

export default MyProfileTemplate;
