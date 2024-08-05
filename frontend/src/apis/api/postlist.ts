import { PageNationData } from "../../util/paging/type";
import api from "../index";

export type PostDto = {
  id: number;
  authorName: string;
  authorId: number;
  content: string;
  heartCount: number;
  isHearted: boolean;
  isPublic: boolean;
  postType: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  postImages: string[];
};

export type GetPostListRequestDto = { "page-no": number };

export type GetPostListResponseDto = PageNationData<PostDto>;

export const getPostList = async (
  dto: GetPostListRequestDto
): Promise<GetPostListResponseDto> => {
  try {
    const response = await api.get("/post/home", { params: dto });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error fetching post list: ${response.statusText}`);
    }
  } catch (error) {
    console.error("게시글 목록 조회 오류:", error);
    throw error;
  }
};
