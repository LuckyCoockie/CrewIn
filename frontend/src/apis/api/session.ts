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

export const SessionStatusType = {
  ALL: "all",
  ACTIVE: "active",
} as const;
export type SessionStatusType =
  (typeof SessionStatusType)[keyof typeof SessionStatusType];
export const sessionStatusTypeToLabel = (type: SessionStatusType) => {
  switch (type) {
    case SessionStatusType.ALL:
      return "전체 세션 조회";
    case SessionStatusType.ACTIVE:
      return "진행 중 인 세션 조회";
  }
};

export type SessionDto = {
  crewName: string;
  sessionName: string;
  spot: string;
  area: string;
  sessionThumbnail: string;
  sessionType: SessionType;
  maxPeople: number;
  sessionId: number;
  startAt: string;
};

export type GetSessionListRequestDto = {
  sessionType?: SessionRequestType;
  "crew-name"?: string;
  date?: string;
  status?: SessionStatusType;
};

export const getSessionList = async (
  dto: GetSessionListRequestDto
): Promise<SessionDto[]> => {
  const response = await api.get("/session", { params: dto });
  return response.data;
};
