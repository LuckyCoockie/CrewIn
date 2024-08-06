import api from "../index";

export type ChangeAuthorityRequestDto = {
  crewId: number;
  memberId: number;
  position: string;
};

export type ChangeAuthorityResponseDto = {
  statusCode: number;
  message: string;
};

export const changeAuthority = async (
  dto: ChangeAuthorityRequestDto
): Promise<ChangeAuthorityResponseDto> => {
  try {
    const response = await api.post("/crew/member/authority", dto);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("권한 변경 오류:", error);
    throw error;
  }
};
