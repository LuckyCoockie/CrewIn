import api from "../index";
import { PageNationData } from "../../util/paging/type";

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

export type GetCrewMemberListResponseDto = PageNationData<CrewMemberDto>;

export const getCrewMemberList = async (
  crewId: number,
  pageNo: number = 0
): Promise<GetCrewMemberListResponseDto> => {
  const response = await api.get(`/crew/member/${crewId}`, {
    params: { "page-no": pageNo },
  });
  return response.data;
};
