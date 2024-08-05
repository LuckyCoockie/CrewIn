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
  const response = await api.get("/post/home", { params: { pageNo } });
  if (response.status === 200) {
    return response.data.postItemList;
  } else {
    throw new Error(`Error fetching post list: ${response.statusText}`);
  }
};
