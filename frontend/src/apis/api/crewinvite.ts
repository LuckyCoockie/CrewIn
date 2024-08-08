import api from "../utils/instance";

export type CrewInviteRequestDto = {
  memberId: number;
  crewId: number;
};

export type CrewInviteResponseDto = {};

export const inviteCrewMember = async (
  dto: CrewInviteRequestDto
): Promise<CrewInviteResponseDto> => {
  try {
    const response = await api.post("/crew/member/invitation", dto);
    console.log(response);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("API 호출 오류:", error);
    throw error;
  }
};
