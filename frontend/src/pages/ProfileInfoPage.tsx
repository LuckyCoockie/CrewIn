import { getMyProfileInfo } from "../apis/api/mypage";
import { uploadImage } from "../apis/api/presigned";
import {
  editProfileImage,
  editNickname,
  editPassword,
} from "../apis/api/profile";
import { ProfileInfoTemplate } from "../components/templates/profile/ProfileInfoTemplate";
import { useNavigate } from "react-router";

export const ProfileInfoPage = () => {
  const navigate = useNavigate();
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
      console.error(error);
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
      console.error("비밀번호 변경 에러", error);
      window.alert("이전 비밀번호를 확인하세요.");
    }
  };

  return (
    <ProfileInfoTemplate
      fetchData={getMyProfileInfo}
      onProfileImageEdit={onProfileImageEdit}
      onNicknameEdit={onNicknameEdit}
      onPasswordEdit={onPasswordEdit}
    />
  );
};
