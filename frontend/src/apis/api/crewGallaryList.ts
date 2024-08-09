import { PageNationData } from "../../util/paging/type";
import api from "../utils/instance";

export type PostDto = {
  id: number;
  authorName: string; //닉네임
  authorId: number;
  content: string;
  heartCount: number;
  isHearted: boolean;
  isPublic: boolean;
  postType: "STANDARD" | "NOTICE";
  title: string;
  createdAt: string;
  updatedAt: string;
  profileImage: string;
  postImages: string[];
};

export type GetCrewGalleryListDetailReqeustParams = {
  pageNo?: number;
};

export type GetCrewGalleryListDetailReqeustDto = {
  crewId: number;
  params: GetCrewGalleryListDetailReqeustParams;
};

export type GetCrewGalleryListDetailResponseDto = PageNationData<PostDto>;

export const getCrewGallaryDetailList = async (
  dto: GetCrewGalleryListDetailReqeustDto
): Promise<GetCrewGalleryListDetailResponseDto> => {
  const response = await api.get(`/post/crew/gallery/detail/${dto.crewId}`, {
    params: dto.params,
  });
  return response.data;
};
