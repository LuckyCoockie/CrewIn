import { PageNationData } from "../../util/paging/type";
import api from "../utils/instance";

// 크루 정보
export type CrewInfoDto = {
  crewId: number;
  crewName: string;
  slogan: string;
  area: string;
  introduction: string;
  crewCount: number;
  captainName: string;
  crewBirth: string;
  mainLogo: string;
  subLogo: string;
  banner: string;
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

// 크루 공지사항 조회
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

export type GetCrewNoticeListResponseDto = PageNationData<CrewNoticeDto>;

export const getCrewNoticeList = async (
  dto: GetCrewNoticeListRequestDto
): Promise<GetCrewNoticeListResponseDto> => {
  const response = await api.get(`/crew/notice/${dto.crewId}`, {
    params: { "page-no": dto.pageNo },
  });
  return response.data;
};

// 크루 공지사항 등록
export type CreateNoticeDto = {
  crewId: number;
  title: string;
  content: string;
  noticeImages: string[];
};

export const createNotice = async (dto: CreateNoticeDto): Promise<void> => {
  const response = await api.post(`/crew/notice`, dto);
  return response.data;
};

// 크루 공지사항 디테일
export type CrewNoticeDetailRequestDto = {
  crewId: number;
  noticeId: number;
};

export type CrewNoticeDetailResponseDto = {
  id: number;
  authorName: string;
  authorId: number;
  content: string;
  heartCount: number;
  isHearted: boolean;
  isPublic: boolean;
  postType: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  postImages: string[];
  profileImage: string;
};

export const getCrewNoticeDetail = async (
  dto: CrewNoticeDetailRequestDto
): Promise<CrewNoticeDetailResponseDto> => {
  const response = await api.get(
    `/crew/notice?crew-id=${dto.crewId}&notice-id=${dto.noticeId}`
  );
  return response.data;
};

// 크루 공지사항 수정
export type EditNoticeRequestDto = {
  noticeId: number;
  crewId: number;
  title: string;
  content: string;
  noticeImages: string[];
};

export const editNotice = async (dto: EditNoticeRequestDto): Promise<void> => {
  const { noticeId, ...body } = dto;
  const response = await api.put(`/crew/notice/${noticeId}`, body);
  return response.data;
};

// 크루 공지사항 삭제 (상세페이지에서 요청보내야할듯?)
export const deleteNotice = async (noticeId: number): Promise<void> => {
  const response = await api.delete(`/crew/notice/${noticeId}`);
  return response.data;
};

// 크루 사진첩 조회
export type CrewGalleryDto = {
  postId: number;
  thumbnailImage: string;
};

export type GetCrewGalleryListRequestDto = {
  crewId: number;
  pageNo: number;
};

export type GetCrewGalleryListResponseDto = PageNationData<CrewGalleryDto>;

export const getCrewGalleryList = async (
  dto: GetCrewGalleryListRequestDto
): Promise<GetCrewGalleryListResponseDto> => {
  const response = await api.get(
    `/post/crew/gallery/${dto.crewId}?page-no=${dto.pageNo}`
  );
  return response.data;
};

// 크루 수정
export type EditCrewRequestDto = {
  crewId: number;
  name: string;
  slogan: string;
  area: string;
  introduction: string;
  mainLogo: string;
  subLogo: string;
  banner: string;
  crewBirth: string;
};

export const editCrew = async (dto: EditCrewRequestDto): Promise<void> => {
  // return console.log("크루 수정 요청 정보: ", dto);

  const { crewId, ...body } = dto;
  const response = await api.put(`/crew/${crewId}`, body);
  return response.data;
};

// 크루 삭제
export const deleteCrew = async (crewId: number): Promise<void> => {
  const response = await api.delete(`/crew/${crewId}`);
  return response.data;
};

// 크루 탈퇴

export const quitCrew = async (crewId: number): Promise<void> => {
  const response = await api.delete(`/crew/${crewId}/leave`);
  return response.data;
};
