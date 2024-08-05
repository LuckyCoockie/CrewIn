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

export type GetPostListResponseDto = PostDto[];

export const getPostList = async (
  pageNo: number
): Promise<GetPostListResponseDto> => {
  try {
    const response = await api.get("/post/home", {
      params: { "page-no": pageNo },
    });
    if (response.status === 200) {
      return response.data.postItemList;
    } else {
      throw new Error(`Error fetching post list: ${response.statusText}`);
    }
  } catch (error) {
    console.error("게시글 목록 조회 오류:", error);
    throw error;
  }
};
