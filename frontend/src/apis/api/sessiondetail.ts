import api from "../utils/instance";

export type SessionDetailDto = {
  sessionId: number;
  courseId: number;
  isSessionHost: boolean;
  hostname: string;
  hostNickname: string;
  crewName: string;
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
  return console.log("세션 수정 요청 정보: ", dto);

  const { sessionId, ...body } = dto;
  const response = await api.put(`/session/detail/${sessionId}`, body);
  return response.data;
};

// 세션 삭제
export const deleteSession = async (sessionId: number): Promise<void> => {
  return console.log("세션 삭제 요청 ID: ", sessionId);

  const response = await api.delete(`/session/detail/${sessionId}`);
  return response.data;
};

// 세션 앨범 조회

export type GetSessionAlbumDto = {
  sessionImageId: number;
  imageUrl: string;
};

export type SessionAlbumResponseDto = {
  pageNo: number;
  lastPageNo: number;
  sessionImages: GetSessionAlbumDto[];
};

export const getSessionAlbum = async (
  sessionId: number,
  pageNo: number
): Promise<SessionAlbumResponseDto> => {
  const response = await api.get(
    `/session/detail/gallery/${sessionId}?page-no=${pageNo}`
  );
  console.log(response.data);

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

// 세션 참가
export type ParticipateSessionRequestDto = {
  sessionId: number;
};

export const participateSession = async (
  dto: ParticipateSessionRequestDto
): Promise<void> => {
  console.log("참가신청 완료");

  const response = await api.post(`/session/${dto}`);
  return response.data;
};
