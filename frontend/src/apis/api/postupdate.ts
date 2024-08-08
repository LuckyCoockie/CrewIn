import api from "../index";

export type UpdatePostRequestDto = {
  title?: string;
  content: string;
  isPublic: boolean;
  postImages: string[];
};

export type UpdatePostResponseDto = {};

export const updatePost = async (
  id: number,
  updateData: UpdatePostRequestDto
): Promise<UpdatePostResponseDto> => {
  try {
    const response = await api.put(`/post/${id}`, updateData);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("게시글 수정 오류:", error);
    throw error;
  }
};
