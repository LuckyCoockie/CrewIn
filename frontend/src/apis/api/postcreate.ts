import api from "../index";

export type CreatePostRequestDto = {
  crewId: number;
  //   title: string;
  content: string;
  isPublic: boolean;
  //   postType: string;
  postImages: string[];
};

export type CreatePostResponseDto = {
  statusCode: number;
  message: string;
};

export const createPost = async (
  dto: CreatePostRequestDto
): Promise<CreatePostResponseDto> => {
  try {
    const response = await api.post("/post", dto);
    return response.data;
  } catch (error) {
    console.error("게시글 생성 오류:", error);
    throw error;
  }
};
