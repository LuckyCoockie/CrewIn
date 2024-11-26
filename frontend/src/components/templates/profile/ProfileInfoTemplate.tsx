import { useState } from "react";
import { EditProfileImageOrganism } from "../../organisms/profile/EditProfileImageOrganism";
import { EditNicknameOrganism } from "../../organisms/profile/EditNicknameOrganism";
import { EditPasswordOrganism } from "../../organisms/profile/EditPasswordOrganism";
import { useQuery } from "react-query";
import { ProfileDto } from "../../../apis/api/mypage";
import { AxiosError } from "axios";
import ErrorResponseDto from "../../../apis/utils/errorCode/ErrorResponseDto";
import DetailInfoMolecule from "../../molecules/Content/DetailInfoMolecule";
import BackHeaderMediumOrganism from "../../organisms/BackHeaderMediumOrganism";
import EditableDetailInfoMolecule from "../../molecules/Content/EditableDetailInfoMolecule";
import MyPageProfileImageComponent from "../../atoms/ImageSize/MyPageProfileImageComponent";

type OwnProps = {
  fetchData: () => Promise<ProfileDto>;
  onProfileImageEdit: (
    { image }: { image?: File },
    onClose: () => void
  ) => Promise<void>;
  onNicknameEdit: (
    { nickname }: { nickname: string },
    onClose: () => void
  ) => Promise<void>;
  onPasswordEdit: (
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    onClose: () => void
  ) => Promise<void>;
};

export const ProfileInfoTemplate = ({
  fetchData,
  onProfileImageEdit,
  onNicknameEdit,
  onPasswordEdit,
}: OwnProps) => {
  const { data } = useQuery<ProfileDto, AxiosError<ErrorResponseDto>>({
    queryKey: [`ProfileInfo`],
    queryFn: () => fetchData(),
  });

  const [isEditProfileImageModalOpen, setIsEditProfileImageModalOpen] =
    useState(false);
  const [isEditNicknameModalOpen, setIsEditNicknameModalOpen] = useState(false);
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);

  const handleOpenEditProfileImageModal = () => {
    setIsEditProfileImageModalOpen(true);
  };

  const handleCloseEditProfileImageModal = () => {
    setIsEditProfileImageModalOpen(false);
  };

  const handleOpenEditNicknameModal = () => {
    setIsEditNicknameModalOpen(true);
  };

  const handleCloseEditNicknameModal = () => {
    setIsEditNicknameModalOpen(false);
  };

  const handleOpenEditPasswordModal = () => {
    setIsEditPasswordModalOpen(true);
  };

  const handleCloseEditPasswordModal = () => {
    setIsEditPasswordModalOpen(false);
  };

  return (
    <>
      <header>
        <BackHeaderMediumOrganism text={"내 정보 변경"} />
      </header>
      <main>
        <div className="w-full flex justify-center py-10">
          <MyPageProfileImageComponent
            src={data?.imageUrl}
            onClick={handleOpenEditProfileImageModal}
          />
        </div>
        <DetailInfoMolecule title="이메일" content={data?.email} />
        <DetailInfoMolecule title="이름" content={data?.name} />
        <EditableDetailInfoMolecule
          title="닉네임"
          content={data?.nickname}
          onClick={handleOpenEditNicknameModal}
        />
        <EditableDetailInfoMolecule
          title="비밀번호"
          content={"⦁⦁⦁⦁⦁⦁"}
          onClick={handleOpenEditPasswordModal}
        />
        {isEditProfileImageModalOpen && (
          <EditProfileImageOrganism
            onClose={handleCloseEditProfileImageModal}
            onEdit={(image) =>
              onProfileImageEdit(image, handleCloseEditProfileImageModal)
            }
          />
        )}
        {isEditNicknameModalOpen && (
          <EditNicknameOrganism
            init={data}
            onClose={handleCloseEditNicknameModal}
            onEdit={(nickname) =>
              onNicknameEdit(nickname, handleCloseEditNicknameModal)
            }
          />
        )}
        {isEditPasswordModalOpen && (
          <EditPasswordOrganism
            onClose={handleCloseEditPasswordModal}
            onEdit={(password) =>
              onPasswordEdit(password, handleCloseEditPasswordModal)
            }
          />
        )}
      </main>
    </>
  );
};
