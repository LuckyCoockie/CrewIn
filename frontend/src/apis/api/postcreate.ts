import api from "../index";

export type CreatePostRequestDto = {
  crewId: number | null;
  content: string;
  isPublic: boolean;
  postImages: string[];
};

export type CreatePostResponseDto = void

export const createPost = async (
  dto: CreatePostRequestDto
): Promise<CreatePostResponseDto> => {
  const response = await api.post("/post", dto);
  return response.data;
};
