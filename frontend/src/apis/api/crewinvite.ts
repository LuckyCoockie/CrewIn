import api from "../utils/instance";

export type MemberDto = {
  memberId: number;
  name: string;
  nickname: string;
  imageUrl: string | null;
  attendanceCount: number | null;
  isJoined: boolean | null;
  isInvited: boolean | null;
};

export type SearchInviteMemberRequestDto = {
  crewId: number; // 크루 ID
  query?: string; // 검색 쿼리
};

export type SearchInviteMemberResponseDto = {
  pageNo: number;
  lastPageNo: number;
  items: MemberDto[];
};

export const searchInviteMember = async (
  dto: SearchInviteMemberRequestDto
): Promise<SearchInviteMemberResponseDto> => {
  const { crewId, query } = dto;
  const response = await api.get(`/search/invite-member/${crewId}`, {
    params: { query },
  });
  return response.data;
};
