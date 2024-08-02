import api from "../index";

export type DeletePostResponseDto = {
  statusCode: number;
  message?: string;
};

export const deletePost = async (
  id: number
): Promise<DeletePostResponseDto> => {
  try {
    const response = await api.delete(`/post/${id}`);
    if (response.status === 204) {
      return { statusCode: 204 };
    } else {
      return response.data;
    }
  } catch (error) {
    console.error("게시글 삭제 오류:", error);
    throw error;
  }
};
