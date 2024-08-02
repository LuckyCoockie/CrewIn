import api from "../utils/instance";

export type ProfileInfoDto = {
  email: string;
  name: string;
  nickname: string;
  imageUrl: string;
};

export const getProfileInfo = async (): Promise<ProfileInfoDto> => {
  // TODO : 더미 데이터 삭제하기
  return {
    email: "email",
    name: "name",
    nickname: "nickname",
    imageUrl: "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
  };
  const response = await api.get("/mypage/profile");
  return response.data;
};
