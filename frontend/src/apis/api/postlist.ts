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
  dto: PostDto
): Promise<GetPostListResponseDto> => {
  const response = await api.get("/post", { params: dto });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error(`Error fetching post list: ${response.statusText}`);
  }
};
