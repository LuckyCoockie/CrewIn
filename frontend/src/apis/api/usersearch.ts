import api from "../index";

export type MemberDto = {
  memberId: number;
  memberNickName: string;
  memberName: string;
  profileUrl: string | null;
};

export type UserSearchResponseDto = {
  pageNo: number;
  lastPageNo: number;
  members: MemberDto[];
};

export type UserSearchRequestDto = {
  query: string;
  pageNo?: number;
};

export const searchMembers = async (
  dto: UserSearchRequestDto
): Promise<UserSearchResponseDto> => {
  const { query, pageNo = 0 } = dto;

  try {
    const response = await api.get<UserSearchResponseDto>("/search/member", {
      params: { query, pageNo },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        `Error fetching user search results: ${response.statusText}`
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to fetch user search results:", error.message);
      throw new Error(`Failed to fetch user search results: ${error.message}`);
    } else {
      console.error("Failed to fetch user search results:", error);
      throw new Error(
        "Failed to fetch user search results: An unknown error occurred."
      );
    }
  }
};
