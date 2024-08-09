import api from "../index";
import { PageNationData } from "../../util/paging/type";

export type CrewSearchMemberDto = {
  memberId: number;
  name: string;
  nickname: string;
  imageUrl: string | null;
  attendanceCount: number;
};

export type CrewSearchMemberResponseDto = PageNationData<CrewSearchMemberDto>;

export const searchCrewMembers = async (
  crewId: number,
  query: string,
  pageNo: number
): Promise<CrewSearchMemberResponseDto> => {
  const response = await api.get(`/search/invite-member/${crewId}`, {
    params: { query, "page-no": pageNo },
  });

  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error(
      `Error fetching invite member search results: ${response.statusText}`
    );
  }
};
