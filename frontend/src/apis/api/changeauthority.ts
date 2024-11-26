import api from "../index";

export type ChangeAuthorityRequestDto = {
  crewId: number;
  memberId: number;
  position: string;
};

export type ChangeAuthorityResponseDto = void;

export const changeAuthority = async (
  dto: ChangeAuthorityRequestDto
): Promise<ChangeAuthorityResponseDto> => {
  const response = await api.post("/crew/member/authority", dto);
  return response.data;
};
