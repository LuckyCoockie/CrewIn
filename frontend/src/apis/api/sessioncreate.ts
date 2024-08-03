import api from "../utils/instance";

export type SessionCreateDto = {
  courseId: number;
  crewId: number | null;
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

export type GetSessionCreateRto = SessionCreateDto;

export const postCreateSession = async (
  dto: GetSessionCreateRto
): Promise<void> => {
  const response = await api.post(`/session`, dto);
  return response.data;
};
