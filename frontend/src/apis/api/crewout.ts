import api from "../index";

export type CrewOutRequestDto = {
  memberId: number;
  crewId: number;
};

export type CrewOutResponseDto = void;

export const crewOut = async (
  dto: CrewOutRequestDto
): Promise<CrewOutResponseDto> => {
  const response = await api.delete("/crew/member", { data: dto });
  return response.data;
};
