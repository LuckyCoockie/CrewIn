import { getMyProfileInfo } from "../apis/api/mypage";
import { uploadImage } from "../apis/api/presigned";
import { editProfileImage, editNickname } from "../apis/api/profile";

import { ProfileInfoTemplate } from "../components/templates/profile/ProfileInfoTemplate";

export const ProfileInfoPage = () => {
  const onProfileImageEdit = async ({ image }: { image?: File }) => {
    try {
      const imageUrl = image ? await uploadImage(image) : undefined;
      if (imageUrl) {
        const imageDto = { profileImageUrl: imageUrl };
        console.log(imageDto);
        await editProfileImage(imageDto);
        // 모달창 닫기
      }
    } catch (error) {
      console.error("프로필 이미지 업로드 에러:", error);
    }
  };

  const onNicknameEdit = async ({ nickname }: { nickname: string }) => {
    try {
      const nicknameDto = { nickname: nickname };
      await editNickname(nicknameDto);
    } catch (error) {
      console.error("닉네임 변경 에러", error);
    }
  };

  const onPasswordEdit = async ({ password }: { password: string }) => {
    console.log(password);
  };

  return (
    <>
      <ProfileInfoTemplate
        fetchData={getMyProfileInfo}
        onProfileImageEdit={onProfileImageEdit}
        onNicknameEdit={onNicknameEdit}
        onPasswordEdit={onPasswordEdit}
      />
    </>
  );
};
