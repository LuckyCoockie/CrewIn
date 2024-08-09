import { PageNationData } from "../../util/paging/type";
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

export const MySessionType = {
  CREATED: "created",
  JOINED: "joined",
} as const;
export type MySessionType = (typeof MySessionType)[keyof typeof MySessionType];
export const mySessionTypeToLabel = (type: MySessionType) => {
  switch (type) {
    case MySessionType.CREATED:
      return "내가 만든 세션 조회";
    case MySessionType.JOINED:
      return "내가 참가한 세션 조회";
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
  crewName?: string;
  date?: string;
  status?: SessionStatusType;
};

export const getSessionList = async (
  dto: GetSessionListRequestDto
): Promise<PageNationData<SessionDto>> => {
  const response = await api.get<PageNationData<SessionDto>>("/session", {
    params: dto,
  });
  return response.data;
};

export type GetMySessionRequestDto = {
  type?: MySessionType;
  sessionType?: SessionType;
  pageNo?: string;
};

export type GetMySessionResponseDto = PageNationData<SessionDto>;

export const getMySessionList = async (
  dto: GetMySessionRequestDto
): Promise<GetMySessionResponseDto> => {
  const response = await api.get<GetMySessionResponseDto>("/mypage/session", {
    params: dto,
  });
  return response.data;
};
