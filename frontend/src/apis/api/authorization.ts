import api from "../index";

export type LoginRequestDto = { email: string; password: string };
export type LoginResponseDto = { accessToken: string };
export type RefreshTokenResponseDto = { accessToken: string };

export const login = async (
  dto: LoginRequestDto
): Promise<LoginResponseDto> => {
  const response = await api.post<LoginResponseDto>("/member/login", dto);
  return response.data;
};

export const refreshAccessToken =
  async (): Promise<RefreshTokenResponseDto> => {
    const response = await api.post<RefreshTokenResponseDto>(
      `/user/reissue`,
      null,
      { withCredentials: true }
    );
    return response.data;
  };
