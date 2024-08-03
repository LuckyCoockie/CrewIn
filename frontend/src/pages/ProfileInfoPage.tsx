import { uploadImage } from "../apis/api/presigned";
import { editProfileImage, getProfileInfo } from "../apis/api/profile";
import { ProfileInfoTemplate } from "../components/templates/profile/ProfileInfoTemplate";

export const ProfileInfoPage = () => {
  const onProfileImageEdit = async ({ image }: { image?: File }) => {
    try {
      const imageUrl = image ? await uploadImage(image) : undefined;
      if (imageUrl) {
        const imageDto = { profileImageUrl: imageUrl };
        console.log(imageDto);
        await editProfileImage(imageDto);
      }
    } catch (error) {
      console.error("업로드 에러:", error);
    }
  };

  const onNicknameEdit = async ({ nickname }: { nickname: string }) => {
    console.log(nickname);
  };

  const onPasswordEdit = async ({ password }: { password: string }) => {
    console.log(password);
  };

  return (
    <>
      <ProfileInfoTemplate
        fetchData={getProfileInfo}
        onProfileImageEdit={onProfileImageEdit}
        onNicknameEdit={onNicknameEdit}
        onPasswordEdit={onPasswordEdit}
      />
    </>
  );
};
