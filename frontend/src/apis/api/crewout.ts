import api from "../index";

export type CrewOutRequestDto = {
  memberId: number;
  crewId: number;
};

export type CrewOutResponseDto = {};

export const crewOut = async (
  dto: CrewOutRequestDto
): Promise<CrewOutResponseDto> => {
  try {
    const response = await api.delete("/crew/member", { data: dto });
    return response.data;
  } catch (error) {
    console.error("크루 멤버 강퇴 오류:", error);
    throw error;
  }
};
