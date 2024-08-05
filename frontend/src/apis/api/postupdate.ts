import api from "../index";

export type UpdatePostRequestDto = {
  title: string;
  content: string;
  isPublic: boolean;
  postType: string;
  postImages: string[];
};

export type UpdatePostResponseDto = {
  statusCode: number;
  message: string;
};

export const updatePost = async (
  id: number,
  updateData: UpdatePostRequestDto
): Promise<UpdatePostResponseDto> => {
  try {
    const response = await api.put(`/post/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error("게시글 수정 오류:", error);
    throw error;
  }
};
