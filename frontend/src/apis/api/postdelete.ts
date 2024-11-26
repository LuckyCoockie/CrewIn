import api from "../index";

export type DeletePostResponseDto = object;

export const deletePost = async (
  id: number
): Promise<DeletePostResponseDto> => {
  const response = await api.delete(`/post/${id}`);
  if (response.status === 204) {
    return { statusCode: 204 };
  } else {
    return response.data;
  }
};
