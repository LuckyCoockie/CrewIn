import api from "../index";

export type GetPostListRequestDto = {};

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
  dto: GetPostListRequestDto
): Promise<GetPostListResponseDto> => {
  const response = await api.get(`/post`);
  return response.data;
};
