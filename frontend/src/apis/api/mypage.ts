import api from "../utils/instance";

export type MyProfileDto = {
  // name: string
  nickname: string;
  totalDistance: number;
  totalTime: number;
  totalAttendance: number;
  imageUrl: string;
};

export const getMyProfileInfo = async (): Promise<MyProfileDto> => {
  const response = await api.get("/mypage");
  return response.data;
};
