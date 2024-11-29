import api from "../index";

export type commentsDto ={
  id: number;
  authorId: number;
  authorName: string;
  authorImage: string;
  content: string;
  createdAt : string;
  updateAt : string;
}

export type PostDetailResponseDto = {
  id: number;
  authorName: string;
  authorId: number;
  content: string;
  heartCount: number;
  isHearted: boolean;
  isPublic: boolean;
  postType: string;
  profileImage: string;
  title: string;
  comments: commentsDto[];
  createdAt: string;
  updatedAt: string;
  postImages: string[];
};

export const getPostDetail = async (
  id: number
): Promise<PostDetailResponseDto> => {
  const response = await api.get(`/post/${id}`);
  return response.data;
};
