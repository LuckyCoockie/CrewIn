import api from "../index";

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
  createdAt: string;
  updatedAt: string;
  postImages: string[];
};

export const getPostDetail = async (
  id: number
): Promise<PostDetailResponseDto> => {
  try {
    const response = await api.get(`/post/${id}`);
    return response.data;
  } catch (error) {
    console.error("게시글 상세 조회 오류:", error);
    throw error;
  }
};
