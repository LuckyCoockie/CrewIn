import api from "../utils/instance";

export type CrewReplyRequestDto = {
  crewId: number;
  noticeId: number; // 알림 id
  replyStatus: boolean;
};

export type CrewReplyResponse = {};

export const replyToCrewInvitation = async (
  dto: CrewReplyRequestDto
): Promise<CrewReplyResponse> => {
  try {
    const response = await api.post("/crew/member/reply", dto);
    return response.data;
  } catch (error) {
    console.error("크루 초대 응답 중 오류가 발생했습니다:", error);
    throw error;
  }
};
