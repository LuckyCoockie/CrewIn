import api from "../index";

export type CreatePostRequestDto = {
  crewId: number | null;
  content: string;
  isPublic: boolean;
  postImages: string[];
};

export type CreatePostResponseDto = {};

export const createPost = async (
  dto: CreatePostRequestDto
): Promise<CreatePostResponseDto> => {
  try {
    const response = await api.post("/post", dto);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("게시글 생성 오류:", error);
    throw error;
  }
};
