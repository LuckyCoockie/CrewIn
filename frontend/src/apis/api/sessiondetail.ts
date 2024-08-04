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
