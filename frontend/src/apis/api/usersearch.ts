import { PageNationData } from "../../util/paging/type";
import api from "../index";

export type MemberDto = {
  memberId: number;
  memberNickName: string;
  memberName: string;
  profileUrl: string | null;
};

export type UserSearchResponseDto = PageNationData<MemberDto>;

export type UserSearchRequestDto = {
  query: string;
  pageNo?: number;
};

export const searchMembers = async (
  dto: UserSearchRequestDto
): Promise<UserSearchResponseDto> => {
  const { query, pageNo } = dto;

  try {
    const response = await api.get<UserSearchResponseDto>("/search/member", {
      params: { query, "page-no": pageNo },
    });

    if (response.status === 200 && response.data) {
      return response.data;
    } else {
      throw new Error(
        `Error fetching user search results: ${response.statusText}`
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user search results: ${error.message}`);
    } else {
      throw new Error(
        "Failed to fetch user search results: An unknown error occurred."
      );
    }
  }
};
