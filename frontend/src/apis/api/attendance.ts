import api from "../index";

export type AttendanceMemberDto = {
  memberSessionId: number;
  name: string;
  nickname: string;
  imageUrl: string;
};

export type GetAttendanceMemberListRequestDto = {
  sessionId: number;
};

export const getAttendanceMemberList = async (
  dto: GetAttendanceMemberListRequestDto
): Promise<AttendanceMemberDto[]> => {
  return [
    {
      memberSessionId: 1,
      name: "name",
      nickname: "nickname",
      imageUrl:
        "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/crewinlogo.webp",
    },
    {
      memberSessionId: 1,
      name: "name",
      nickname: "nickname",
      imageUrl:
        "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/crewinlogo.webp",
    },
    {
      memberSessionId: 1,
      name: "name",
      nickname: "nickname",
      imageUrl:
        "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/crewinlogo.webp",
    },
    {
      memberSessionId: 1,
      name: "name",
      nickname: "nickname",
      imageUrl:
        "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/crewinlogo.webp",
    },
    {
      memberSessionId: 1,
      name: "name",
      nickname: "nickname",
      imageUrl:
        "https://crewin-bucket.s3.ap-northeast-2.amazonaws.com/crewin/crewinlogo.webp",
    },
  ];
  const response = await api.get<AttendanceMemberDto[]>(
    `/attendence/member/${dto.sessionId}`
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
};

export const postAttend = async (dto: PostAttendRequestDto) => {
  await api.post(`/attendance/guest/${dto.sessionId}`);
};
