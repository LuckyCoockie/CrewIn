import api from "../utils/instance";

// 개인 프로필 이미지 변경 api
export type ImageDto = {
  profileImageUrl: string;
};

export type ImageRequestDto = ImageDto;

export const editProfileImage = async (dto: ImageRequestDto): Promise<void> => {
  const response = await api.put("/mypage/profile/image", dto);
  return response.data;
};

// 닉네임 변경 api
export type NicknameDto = {
  nickname: string;
};

export type NicknameRequestDto = NicknameDto;

export const editNickname = async (dto: NicknameRequestDto): Promise<void> => {
  const response = await api.put("/mypage/profile/nickname", dto);
  return response.data;
};

// 비밀번호 변경 api
export type NewPasswordRequestDto = {
  oldPassword: string;
  newPassword: string;
};

export const editPassword = async (
  dto: NewPasswordRequestDto
): Promise<void> => {
  const response = await api.put(`/member/password`, dto);
  return response.data;
};
