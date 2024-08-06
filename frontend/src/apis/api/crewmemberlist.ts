import api from "../index";

export type CrewMemberDto = {
  memberId: number;
  nickname: string;
  name: string;
  email: string;
  imageUrl: string | null;
  position: string;
  attendanceCount: number;
  joined: boolean;
  invited: boolean;
};

export type CrewMemberListResponseDto = {
  pageNo: number;
  lastPageNo: number;
  items: CrewMemberDto[];
};

export const getCrewMemberList = async (
  crewId: number
): Promise<CrewMemberListResponseDto> => {
  const response = await api.get<CrewMemberListResponseDto>(
    `/crew/member/${crewId}`
  );
  return response.data;
};
