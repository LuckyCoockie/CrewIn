import api from "../utils/instance";

// 크루 정보
export type CrewInfoDto = {
  id: number;
  crewName: string;
  slogan: string;
  area: string;
  crewCount: number;
  captainName: string;
  imageUrl: string;
  introduction: string;
  crewBirth: string;
};

export type GetCrewInfoRequestDto = {
  crewId: number;
};

export type GetCrewInfoResponseDto = CrewInfoDto;

export const getCrewInfo = async (
  dto: GetCrewInfoRequestDto
): Promise<GetCrewInfoResponseDto> => {
  const response = await api.get(`/crew/detail/${dto.crewId}`);
  return response.data;
};

// 크루 공지사항
export type CrewNoticeDto = {
  noticeId: number;
  position: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type GetCrewNoticeListRequestDto = {
  crewId: number;
  pageNo: number;
};

export type GetCrewNoticeListResponseDto = {
  crewNoticeList: CrewNoticeDto[];
  pageNo: number;
  lastPageNo: number;
};

export const getCrewNoticeList = async (
  dto: GetCrewNoticeListRequestDto
): Promise<GetCrewNoticeListResponseDto> => {
  const response = await api.get(`/crew/notice/${dto.crewId}`, {
    params: { pageNo: dto.pageNo },
  });
  return response.data;
};

// 크루 사진첩
export type CrewGalleryDto = {
  postId: number;
  imageUrls: string[];
};

export type GetCrewGalleryListRequestDto = {
  crewId: number;
  pageNo: number;
};

export type GetCrewGalleryListResponseDto = {
  crewGalleryList: CrewGalleryDto[];
  pageNo: number;
  lastPageNo: number;
};

export const getCrewGalleryList = async (
  dto: GetCrewGalleryListRequestDto
): Promise<GetCrewGalleryListResponseDto> => {
  const response = await api.get(`/crew/gallery/${dto.crewId}`, {
    params: { pageNo: dto.pageNo },
  });
  return response.data;
};
