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
};

export type GetCrewGalleryListDetailReqeustDto = {
  crewId: number;
  params: GetCrewGalleryListDetailReqeustParams;
};

export type GetCrewGalleryListDetailResponseDto = {
  pageNo: number;
  lastPageNo: number;
  items: PostDto[];
};

export const getCrewGallaryDetailList = async (
  dto: GetCrewGalleryListDetailReqeustDto
): Promise<GetCrewGalleryListDetailResponseDto> => {
  // TODO : 누른애가 안나옴...
  const response = await api.get(`/post/crew/gallery/detail/${dto.crewId}`, {
    params: dto.params,
  });
  return response.data;
};
