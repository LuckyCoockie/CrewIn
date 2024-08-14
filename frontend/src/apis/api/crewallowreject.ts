import api from "../utils/instance";

export type CrewReplyRequestDto = {
  crewId: number;
  noticeId: number; // 알림 id
  replyStatus: boolean;
};

export type CrewReplyResponse = void;

export const replyToCrewInvitation = async (
  dto: CrewReplyRequestDto
): Promise<CrewReplyResponse> => {
  const response = await api.post("/crew/member/reply", dto);
  return response.data;
};
