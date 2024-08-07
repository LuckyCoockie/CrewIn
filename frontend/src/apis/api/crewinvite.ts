import api from "../utils/instance";

export type CrewInviteRequestDto = {
  memberId: number;
  crewId: number;
};

export type CrewInviteResponseDto = {
  statusCode: number;
  message: string;
};

export const inviteCrewMember = async (
  dto: CrewInviteRequestDto
): Promise<CrewInviteResponseDto> => {
  try {
    const response = await api.post("/crew/member/invitation", dto);
    return response.data;
  } catch (error) {
    console.error("API 호출 오류:", error);
    throw error;
  }
};
