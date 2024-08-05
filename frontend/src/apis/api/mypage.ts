import api from "../utils/instance";

// 프로필 상단 정보
export type ProfileDto = {
  name: string;
  nickname: string;
  totalDistance: number;
  totalTime: number;
  totalAttendance: number;
  imageUrl: string;
};

export const getMyProfileInfo = async (
  memberId: number | null
): Promise<ProfileDto> => {
  console.log(memberId);
  const response = await api.get(`/member/profile/${memberId}`);
  return response.data;
};

// 내가 만든 세션
export type MyMadeSessionDto = {
  startAt: string;
  sessionName: string;
  imageUrl: string;
  sessionId: number;
};

export type MyMadeSessionsResponseDto = {
  pageNo: number;
  lastPageNo: number;
  sessions: MyMadeSessionDto[];
};

export const getMyMadeSessions = async (
  pageNo: number
): Promise<MyMadeSessionsResponseDto> => {
  const response = await api.get(
    `/mypage/session?type=created&page-no=${pageNo}`
  );
  return response.data;
};

// 내가 참가한 세션
export type MyParticipatedSessionDto = {
  startAt: string;
  sessionName: string;
  imageUrl: string;
  sessionId: number;
};

export type MyParticipatedSessionsResponseDto = {
  pageNo: number;
  lastPageNo: number;
  sessions: MyParticipatedSessionDto[];
};

export const getMyParticipatedSessions = async (
  pageNo: number
): Promise<MyParticipatedSessionsResponseDto> => {
  const response = await api.get(
    `/mypage/session?type=joined&page-no=${pageNo}`
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

export type MyGalleryResponseDto = {
  pageNo: number;
  lastPageNo: number;
  postGalleryList: MyGalleryDto[];
};

export const getMyGallery = async (
  pageNo: number
): Promise<MyGalleryResponseDto> => {
  const response = await api.get(`/mypage/detail/gallery?page-no=${pageNo}`);
  return response.data;
};

// 남의 게시글 사진첩 조회
export type PeopleGalleryDto = {
  postId:number
  thumbnailImage: string
}

export type PeopleGalleryResponseDto = {
  pageNo: number;
  lastPageNo: number;
  postGalleryList: MyGalleryDto[];
}
export const getPeopleGallery = async (
  pageNo: number, memberId: number
): Promise<MyGalleryResponseDto> => {
  const response = await api.get(`/post/member/gallery/${memberId}?page-no=${pageNo}`);
  return response.data;
};