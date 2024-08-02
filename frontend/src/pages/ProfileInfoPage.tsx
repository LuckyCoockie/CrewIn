import { uploadImage } from "../apis/api/presigned";
import { getProfileInfo } from "../apis/api/profile";
import { ProfileInfoTemplate } from "../components/templates/profile/ProfileInfoTemplate";

export const ProfileInfoPage = () => {
  const onProfileImageEdit = async ({ image }: { image?: File }) => {
    const imageUrl = image ? uploadImage(image) : undefined;
    console.log(imageUrl);
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
