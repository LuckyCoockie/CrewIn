import { PageNationData } from "../../util/paging/type";
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
  // 임시 데이터
  return {
    sessionId: 1,
    courseId: 1,
    isSessionHost: true,
    hostname: "김테스트",
    hostNickname: "테스트에용",
    crewName: "RunnersPro",
    sessionName: "Morning Run",
    spot: "Seoul Park",
    area: "Seoul",
    content: "Join us for a refreshing morning run.",
    courseThumbnail:
      "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
    pace: 6,
    maxPeople: 20,
    startAt: "2024-08-01 07:00:00",
    endAt: "2024-08-01 08:00:00",
    sessionType: "STANDARD",
    sessionPosters: [
      "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
      "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
      "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
    ],
  };
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
  return console.log("크루 삭제 요청 ID: ", sessionId);

  const response = await api.delete(`/session/detail/${sessionId}`);
  return response.data;
};

// 세션 앨범 조회

export type GetSessionAlbumRequestDto = {
  sessionId: number;
  pageNo: number;
};

export type SessionAlbumResponseDto = PageNationData<string>;

export const getSessionAlbum = async (
  dto: GetSessionAlbumRequestDto
): Promise<SessionAlbumResponseDto> => {
  return {
    pageNo: 0,
    lastPageNo: 0,
    items: [
      "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
      "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
      "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
      "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
      "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
      "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
      "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
    ],
  };
  const { sessionId, pageNo } = dto;
  const response = await api.get(`/session/detail/gallery/${sessionId}`, {
    params: { pageNo },
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
  return console.log("사진 업로드", dto);

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
