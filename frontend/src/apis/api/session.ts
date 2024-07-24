import api from "../utils/instance";

export type SessionDto = {
  sessionId: number;
  sessionName: string;
  crewName: string;
  area: string;
  spot: string;
  sessionType: "STANDARD" | "OPEN" | "THUNDER";
  maxPeople: number;
  sessionThumbnail: string;
  startAt: string;
};

export type GetSessionListRequestDto = {
  pageNo: number;
};

export type GetSessionListResponseDto = {
  sessions: SessionDto[];
};

export const getSessionList = async (
  dto: GetSessionListRequestDto
): Promise<GetSessionListResponseDto> => {
  return {
    sessions: [
      {
        sessionId: 1,
        crewName: "CAUON",
        sessionName: "러닝",
        spot: "세븐일레븐",
        area: "진평동",
        sessionThumbnail:
          "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
        sessionType: "STANDARD",
        maxPeople: 20,
        startAt: "2025-07-20 06:00:00",
      },
      {
        sessionId: 2,
        crewName: "CAUON",
        sessionName: "러닝",
        spot: "세븐일레븐",
        area: "진평동",
        sessionThumbnail:
          "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
        sessionType: "STANDARD",
        maxPeople: 20,
        startAt: "2025-07-20 06:00:00",
      },
      {
        sessionId: 3,
        crewName: "CAUON",
        sessionName: "러닝",
        spot: "세븐일레븐",
        area: "진평동",
        sessionThumbnail:
          "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
        sessionType: "STANDARD",
        maxPeople: 20,
        startAt: "2025-07-20 06:00:00",
      },
      {
        sessionId: 4,
        crewName: "CAUON",
        sessionName: "러닝",
        spot: "세븐일레븐",
        area: "진평동",
        sessionThumbnail:
          "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/2a72ccf3-7b42-4be8-a1ca-9aa65bba1f7f.png",
        sessionType: "STANDARD",
        maxPeople: 20,
        startAt: "2025-07-20 06:00:00",
      },
    ],
  };
  const response = await api.get("/session", { params: dto });
  return response.data;
};
