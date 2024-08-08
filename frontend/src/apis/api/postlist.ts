import { PageNationData } from "../../util/paging/type";
import api from "../index";

export type PostDto = {
  id: number;
  authorName: string; //닉네임
  authorId: number;
  content: string;
  heartCount: number;
  isHearted: boolean;
  isPublic: boolean;
  postType: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  profileImage: string;
  postImages: string[];
};

export type GetPostListResponseDto = PageNationData<PostDto>;

export const getPostList = async (
  pageNo: number
): Promise<GetPostListResponseDto> => {
  try {
    const response = await api.get("/post/home", {
      params: { "page-no": pageNo },
    });
    return response.data;
  } catch (error) {
    console.error("게시글 목록 조회 오류:", error);
    throw error;
  }
};
