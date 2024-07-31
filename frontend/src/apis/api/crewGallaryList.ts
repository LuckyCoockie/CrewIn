import api from "../utils/instance";

export type PostDto = {
  id: number;
  crewName: string;
  authorEmail: string;
  content: string;
  heartCount: number;
  isHearted: boolean;
  isPublic: boolean;
  postType: "STANDARD" | "NOTICE";
  title: string;
  createdAt: string;
  updatedAt: string;
  postImages: string[];
};

export type GetCrewGalleryListDetailReqeustParams = {
  postId: number;
  direction: "increase" | "decrease";
  offset: number;
};

export type GetCrewGalleryListDetailReqeustDto = {
  crewId: number;
  params: GetCrewGalleryListDetailReqeustParams;
};

export type GetCrewGalleryListDetailResponseDto = {
  posts: PostDto[];
};

export const getCrewGallaryDetailList = async (
  dto: GetCrewGalleryListDetailReqeustDto
): Promise<GetCrewGalleryListDetailResponseDto> => {
  const response = await api.get(`/crew/gallery/${dto.crewId}`, {
    params: dto.params,
  });
  return response.data;
};
