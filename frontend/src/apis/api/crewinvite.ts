import api from "../utils/instance";

export type CrewInviteRequestDto = {
  memberId: number;
  crewId: number;
};

export type CrewInviteResponseDto = void;

export const inviteCrewMember = async (
  dto: CrewInviteRequestDto
): Promise<CrewInviteResponseDto> => {
  const response = await api.post("/crew/member/invitation", dto);
  return response.data;
};
