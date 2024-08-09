import api from "../index";

export type AttendanceMemberDto = {
  memberSessionId: number;
  name: string;
  nickname: string;
  profileUrl: string;
  isAttend: boolean;
};

export type GetAttendanceMemberListRequestDto = {
  sessionId: number;
};

export type GetAttendanceMemberListResponseDto = {
  items: AttendanceMemberDto[];
  autoCheckInProgress: boolean;
};

export const getAttendanceMemberList = async (
  dto: GetAttendanceMemberListRequestDto
): Promise<GetAttendanceMemberListResponseDto> => {
  const response = await api.get<GetAttendanceMemberListResponseDto>(
    `/attendance/member/${dto.sessionId}`
  );
  return response.data;
};

export type StartAttendanceRequestDto = {
  sessionId: number;
  lat: number;
  lng: number;
};

export const startAttendance = async (dto: StartAttendanceRequestDto) => {
  await api.post(`/attendance/start/${dto.sessionId}`, dto);
};

export type ChangeAttendRequestDto = {
  memberSessionId: number;
  attend: boolean;
};

export const changeAttend = async (dto: ChangeAttendRequestDto) => {
  await api.put(`/attendance/${dto.memberSessionId}`, null, {
    params: { attend: dto.attend },
  });
};

export type PostAttendRequestDto = {
  sessionId: number;
  lat: number;
  lng: number;
};

export const postAttend = async (dto: PostAttendRequestDto) => {
  await api.post(`/attendance/guest/${dto.sessionId}`, dto);
};
