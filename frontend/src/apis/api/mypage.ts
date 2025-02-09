import { PageNationData } from "../../util/paging/type";
import api from "../utils/instance";
import { PostDto } from "./postlist";

// 프로필 상단 정보
export type ProfileDto = {
  name: string;
  nickname: string;
  totalDistance: number;
  totalTime: number;
  totalAttendance: number;
  imageUrl: string;
  email?: string | null;
};

export const getMyProfileInfo = async (): Promise<ProfileDto> => {
  const response = await api.get(`/member/profile`);
  return response.data;
};

export const getPeopleProfileInfo = async (
  memberId: number
): Promise<ProfileDto> => {
  const response = await api.get(`/member/profile/${memberId}`);
  return response.data;
};

// 내가 만든 세션
export type MyMadeSessionDto = {
  startAt: string;
  endAt: string;
  sessionName: string;
  sessionThumbnail: string;
  sessionId: number;
  crewName: string;
  area: string;
};

export type MyMadeSessionsResponseDto = PageNationData<MyMadeSessionDto>;

export const getMyMadeSessions = async (
  pageNo: number
): Promise<MyMadeSessionsResponseDto> => {
  const response = await api.get(
    `/mypage/session?type=created&session-type=ALL&page-no=${pageNo}`
  );
  return response.data;
};

// 내가 신청한 세션
export type MyParticipatedSessionDto = {
  startAt: string;
  endAt: string;
  sessionName: string;
  sessionThumbnail: string;
  sessionId: number;
  crewName: string;
  area: string;
};

export type MyParticipatedSessionsResponseDto =
  PageNationData<MyParticipatedSessionDto>;

export const getMyParticipatedSessions = async (
  pageNo: number
): Promise<MyParticipatedSessionsResponseDto> => {
  const response = await api.get(
    `/mypage/session?type=joined&session-type=ALL&page-no=${pageNo}`
  );
  return response.data;
};

// 내가 만든 지도
export type MyMapsDto = {
  id: number;
  name: string;
  thumbnailImage: string;
};

export const getMyMaps = async (): Promise<MyMapsDto[]> => {
  const response = await api.get("/course");
  return response.data;
};

// 내 게시글 사진첩 조회
export type MyGalleryDto = {
  postId: number;
  thumbnailImage: string;
};

export type MyGalleryResponseDto = PageNationData<MyGalleryDto>;

export const getMyGallery = async (
  pageNo: number,
  memberId: number
): Promise<MyGalleryResponseDto> => {
  const response = await api.get(
    `/post/member/gallery/${memberId}?page-no=${pageNo}`
  );
  return response.data;
};

// 남의 게시글 사진첩 조회
export type PeopleGalleryDto = {
  postId: number;
  thumbnailImage: string;
};

export type PeopleGalleryResponseDto = {
  pageNo: number;
  lastPageNo: number;
  items: MyGalleryDto[];
};
export const getPeopleGallery = async (
  pageNo: number,
  memberId: number
): Promise<PeopleGalleryResponseDto> => {
  const response = await api.get(
    `/post/member/gallery/${memberId}?page-no=${pageNo}`
  );
  return response.data;
};

export type PeopleGalleryDetailRequestDto = {
  pageNo: number;
  memberId: number;
};
export type PeopleGalleryDetailResponseDto = PageNationData<PostDto>;
export const getPeopleGalleryDetail = async (
  dto: PeopleGalleryDetailRequestDto
): Promise<PeopleGalleryDetailResponseDto> => {
  const response = await api.get(
    `/post/member/gallery/detail/${dto.memberId}?page-no=${dto.pageNo}`
  );
  return response.data;
};
