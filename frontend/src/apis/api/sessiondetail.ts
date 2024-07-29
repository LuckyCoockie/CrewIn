import api from "../utils/instance";

export type SessionInfoDto = {
  sessionId: number;
  courseId: number;
  hostId: number;
  hostname: string;
  hostNickname: string;
  crewName: string;
  sessionName: string;
  spot: string;
  area: string;
  content: string;
  pace: number;
  maxPeople: number;
  startAt: string;
  endAt: string;
  sessionType: string;
  sessionPosters: string[];
};

export type GetSessionInfoRequestDto = {
  sessionId: number;
};

export type GetSessionInfoResponseDto = {
  sessionInfo: SessionInfoDto;
};

export const getSessionDetail = async (
  dto: GetSessionInfoRequestDto
): Promise<GetSessionInfoResponseDto> => {
  const response = await api.get(`/session/detail/${dto.sessionId}`);
  return response.data;
};
