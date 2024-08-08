import api from "../index";

export type ChangeAuthorityRequestDto = {
  crewId: number;
  memberId: number;
  position: string;
};

export type ChangeAuthorityResponseDto = {};

export const changeAuthority = async (
  dto: ChangeAuthorityRequestDto
): Promise<ChangeAuthorityResponseDto> => {
  try {
    const response = await api.post("/crew/member/authority", dto);
    return response.data;
  } catch (error) {
    console.error("권한 변경 오류:", error);
    throw error;
  }
};
