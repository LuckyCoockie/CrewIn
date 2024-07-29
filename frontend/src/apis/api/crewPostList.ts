import api from "../utils/instance";

export type PostDto = {
  postId: number;
  userThumenail: string;
  userId: number;
  userName: string;
  time: string;
  croppedImages: string[];
  content: string;
  likes: number;
  hasLiked: boolean;
};

export type GetCrewGalleryListDetailReqeustParams = {
  postId: number;
  direction: "increase" | "decrease" | "both";
  offset: number;
};

export type GetCrewGalleryListDetailReqeustDto = {
  crewId: string;
} & GetCrewGalleryListDetailReqeustParams;

export type GetCrewGalleryListDetailResponseDto = {
  posts: PostDto[];
};

export const getCrewGallaryDetailList = async (
  dto: GetCrewGalleryListDetailReqeustDto
): Promise<GetCrewGalleryListDetailResponseDto> => {
  const response = await api.get(`/crew/gallery/${dto.crewId}`, {
    params: dto as GetCrewGalleryListDetailReqeustParams,
  });
  return response.data;
};
