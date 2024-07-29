import api from "../utils/instance";

export type SessionCreateDto = {
  courseId: number;
  crewId: number;
  sessionType: string;
  name: string;
  images: string[];
  pace: number;
  spot: string;
  startAt: string;
  endAt: string;
  content: string;
  maxPeople: number;
};

export type PostSessionCreateRto = {
  data: SessionCreateDto;
};

export const postSession = async (dto: PostSessionCreateRto): Promise<> => {
  const response = await api.post(`/session/create`);
  return response.data;
};
