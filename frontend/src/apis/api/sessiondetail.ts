import { PageNationData } from "../../util/paging/type";
import api from "../utils/instance";

export type SessionDetailDto = {
  sessionId: number;
  courseId: number;
  isSessionHost: boolean;
  hostname: string;
  hostNickname: string;
  crewName: string | null;
  courseThumbnail: string;
  sessionName: string;
  spot: string;
  area: string;
  content: string;
  pace: number;
  maxPeople: number;
  startAt: string;
  endAt: string;
  sessionType: string;
  sessionPosters: string[];
  isJoined: boolean;
  currentPeople: number;
  courseDistance: number;
  isMyCrew: boolean;
};

export type GetSessionInfoRequestDto = {
  sessionId: number;
};

export type GetSessionInfoResponseDto = SessionDetailDto;

export const getSessionDetail = async (
  dto: GetSessionInfoRequestDto
): Promise<GetSessionInfoResponseDto> => {
  const response = await api.get(`/session/detail/${dto.sessionId}`);
  return response.data;
};

// 세션 수정
export type EditSessionRequestDto = {
  sessionId: number;
  courseId: number;
  sessionType: string;
  name: string;
  images: string[];
  pace: number;
  spot: string;
  startAt: string;
  endAt: string;
  content: string;
  maxPeople: number;
};

export const editSession = async (
  dto: EditSessionRequestDto
): Promise<void> => {
  const { sessionId, ...body } = dto;
  const response = await api.put(`/session/detail/${sessionId}`, body);
  return response.data;
};

// 세션 삭제
export const deleteSession = async (sessionId: number): Promise<void> => {
  const response = await api.delete(`/session/detail/${sessionId}`);
  return response.data;
};

// 세션 앨범 조회

export type GetSessionAlbumDto = {
  sessionImageId: number;
  imageUrl: string;
};

export type SessionAlbumResponseDto = PageNationData<GetSessionAlbumDto>;

export const getSessionAlbum = async (
  pageNo: number,
  sessionId: number
): Promise<SessionAlbumResponseDto> => {
  const response = await api.get(`/session/detail/gallery/${sessionId}`, {
    params: { "page-no": pageNo },
  });

  return response.data;
};

// 세션 앨범 업로드
export type UploadSessionImageRequestDto = {
  sessionId: number;
  sessionImageUrls: string[];
};

export const uploadSessionImages = async (
  dto: UploadSessionImageRequestDto
): Promise<void> => {
  const response = await api.post(`/session/detail/gallery`, dto);
  return response.data;
};

// 세션 앨범 삭제
export const deleteSessionImage = async (imageId: number): Promise<void> => {
  const response = await api.delete(`/session/detail/gallery/${imageId}`);
  return response.data;
};

// 세션 참가

export const participateSession = async (sessionId: number): Promise<void> => {
  const response = await api.post(`/session/${sessionId}`);
  console.log("참가 신청 완료");
  return response.data;
};

// 세션 취소
export type CancelSEssionRequestDto = {
  sessionId: number;
};

export const cancelSession = async (sessionId: number): Promise<void> => {
  const response = await api.delete(`session/${sessionId}`);
  console.log("참가 취소 완료");

  return response.data;
};
