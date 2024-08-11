import { useState } from "react";
import { getMyProfileInfo } from "../apis/api/mypage";
import { uploadImage } from "../apis/api/presigned";
import {
  editProfileImage,
  editNickname,
  editPassword,
} from "../apis/api/profile";
import Modal from "../components/molecules/ModalMolecules";
import { ProfileInfoTemplate } from "../components/templates/profile/ProfileInfoTemplate";
import { useNavigate } from "react-router";

export const ProfileInfoPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

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
        navigate(`/profile`, { replace: true });
      }
    } catch (error) {
      setModalMessage(
        "프로필 이미지 업로드에 실패했습니다. 잠시 후 다시 시도해주세요."
      );
      setIsModalOpen(true);
      console.error("프로필 이미지 업로드 에러:", error);
    }
  };

  const onNicknameEdit = async (
    { nickname }: { nickname: string },
    onClose: () => void
  ) => {
    try {
      const nicknameDto = { nickname };
      await editNickname(nicknameDto);
      onClose(); // 성공적으로 변경 후 모달 닫기
      navigate(`/profile`, { replace: true });
    } catch (error) {
      setModalMessage("닉네임 변경에 실패했습니다. 아이디를 확인하세요.");
      setIsModalOpen(true);
      console.error("닉네임 변경 에러:", error);
    }
  };

  const onPasswordEdit = async (
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    onClose: () => void
  ) => {
    const submitData = { oldPassword, newPassword };
    try {
      await editPassword(submitData);
      onClose(); // 성공적으로 변경 후 모달 닫기
      navigate(`/profile`, { replace: true });
    } catch (error) {
      setModalMessage(
        "비밀번호 변경에 실패했습니다. 이전 비밀번호를 확인하세요."
      );
      setIsModalOpen(true);
      console.error("비밀번호 변경 에러", error);
    }
  };

  return (
    <>
      <ProfileInfoTemplate
        fetchData={getMyProfileInfo}
        onProfileImageEdit={onProfileImageEdit}
        onNicknameEdit={onNicknameEdit}
        onPasswordEdit={onPasswordEdit}
      />
      {isModalOpen && (
        <Modal title="오류" onClose={handleModalClose}>
          <p>{modalMessage}</p>
        </Modal>
      )}
    </>
  );
};
