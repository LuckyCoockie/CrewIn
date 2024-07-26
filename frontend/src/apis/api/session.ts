import api from "../utils/instance";

export const SessionTypeData = {
  STANDARD: "STANDARD",
  OPEN: "OPEN",
  THUNDER: "THUNDER",
} as const;
export type SessionType =
  (typeof SessionTypeData)[keyof typeof SessionTypeData];
export const sessionTypeToLabel = (type: SessionType) => {
  switch (type) {
    case SessionTypeData.STANDARD:
      return "정규런";
    case SessionTypeData.OPEN:
      return "오픈런";
    case SessionTypeData.THUNDER:
      return "번개런";
  }
};

export const SessionRequestTypeData = {
  ALL: "all",
  STANDARD: "standard",
  OPEN: "open",
  THUNDER: "thunder",
} as const;
export type SessionRequestType =
  (typeof SessionRequestTypeData)[keyof typeof SessionRequestTypeData];

export const sessionRequestTypeToLabel = (type: SessionRequestType) => {
  switch (type) {
    case SessionRequestTypeData.ALL:
      return "전체";
    case SessionRequestTypeData.STANDARD:
      return "정규런";
    case SessionRequestTypeData.OPEN:
      return "오픈런";
    case SessionRequestTypeData.THUNDER:
      return "번개런";
  }
};

export type SessionDto = {
  sessionId: number;
  sessionName: string;
  crewName: string;
  area: string;
  spot: string;
  sessionType: SessionType;
  maxPeople: number;
  sessionThumbnail: string;
  startAt: string;
};

export type GetSessionListRequestDto = {
  type?: SessionRequestType;
  "crew-name"?: string;
  date?: string;
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
