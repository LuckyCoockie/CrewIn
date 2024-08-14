import api from "../index";

export type UpdatePostRequestDto = {
  title?: string;
  content: string;
  isPublic: boolean;
  postImages: string[];
};

export type UpdatePostResponseDto = void;

export const updatePost = async (
  id: number,
  updateData: UpdatePostRequestDto
): Promise<UpdatePostResponseDto> => {
  const response = await api.put(`/post/${id}`, updateData);
  return response.data;
};
