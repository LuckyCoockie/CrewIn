import api from "../index";

export type CaptainChangeRequestDto = {
  crewId: number;
  memberId: number;
  position: string;
};

export type CaptainChangeResponseDto = {};

export const changeCaptain = async (
  dto: CaptainChangeRequestDto
): Promise<CaptainChangeResponseDto> => {
  try {
    const response = await api.post("/crew/member/captain", dto);
    return response.data;
  } catch (error) {
    console.error("캡틴 승계 오류:", error);
    throw error;
  }
};
