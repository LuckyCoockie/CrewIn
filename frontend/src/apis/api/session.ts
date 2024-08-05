import api from "../utils/instance";

export const SessionType = {
  STANDARD: "STANDARD",
  OPEN: "OPEN",
  THUNDER: "THUNDER",
} as const;
export type SessionType = (typeof SessionType)[keyof typeof SessionType];
export const sessionTypeToLabel = (type: SessionType) => {
  switch (type) {
    case SessionType.STANDARD:
      return "정규런";
    case SessionType.OPEN:
      return "오픈런";
    case SessionType.THUNDER:
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
      return "진행 중인 세션 조회";
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
  type?: SessionType;
  crewname?: string;
  date?: string;
  status?: SessionStatusType;
};

export const getSessionList = async (
  dto: GetSessionListRequestDto
): Promise<SessionDto[]> => {
  const response = await api.get<SessionDto[]>("/session", { params: dto });
  return response.data.filter((value) =>
    value.startAt.includes(dto.date ?? "")
  );
};
