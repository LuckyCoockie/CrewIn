import api from "../utils/instance";

export type EmailCheckDto = {
  email: string;
};

// 이메일 중복 확인
export type CheckEmailDuplicationDto = EmailCheckDto;

export type DuplicatedEmailResponseDto = {
  duplicated: boolean;
};

export const getEmailDuplicationCheck = async (
  dto: CheckEmailDuplicationDto
): Promise<DuplicatedEmailResponseDto> => {
  const response = await api.get(`/member/check-email`, {
    params: {
      email: dto.email,
    },
  });
  return response.data;
};

// 이메일 확인 후 인증 메일

export type EmailCheckRequestDto = EmailCheckDto;

export const postMemberCheck = async (
  dto: EmailCheckRequestDto
): Promise<void> => {
  const response = await api.post(`/member/signup/email`, dto);
  return response.data;
};

// 인증 코드 확인

export type MemberCodeCheckDto = {
  email: string;
  code: string;
};

export type MemberCodeCheckResponseDto = {
  verified: boolean;
};

export const getCodeCheck = async (
  dto: MemberCodeCheckDto
): Promise<MemberCodeCheckResponseDto> => {
  const response = await api.get(`/member/signup/email`, {
    params: {
      email: dto.email,
      code: dto.code,
    },
  });
  return response.data;
};

// 회원가입

export type JoinMemberInfoDto = {
  name: string;
  nickname: string;
  email?: string;
  password: string;
};

export const joinMember = async (dto: JoinMemberInfoDto): Promise<void> => {
  const response = await api.post(`/member/signup`, dto);
  return response.data;
};
