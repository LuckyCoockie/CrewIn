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
  crewMemberList: CrewMemberDto[];
};


export const getCrewMemberList = async (
  crewId: number
): Promise<CrewMemberListResponseDto> => {
  try {
    const response = await api.get<CrewMemberListResponseDto>(
      `/crew/member/${crewId}`
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        `Error fetching crew member list: ${response.statusText}`
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to fetch crew member list:", error.message);
      throw new Error(`Failed to fetch crew member list: ${error.message}`);
    } else {
      console.error("Failed to fetch crew member list:", error);
      throw new Error(
        "Failed to fetch crew member list: An unknown error occurred."
      );
    }
  }
};