import store from "../../modules";
import {
  loading,
  setAccessToken,
  setMemberId,
} from "../../modules/reducers/auth";
import api from "../index";

export type LoginRequestDto = { email: string; password: string };
export type LoginResponseDto = { accessToken: string; memberId: number };

export const login = async (
  dto: LoginRequestDto
): Promise<LoginResponseDto> => {
  store.dispatch(loading());
  const response = await api.post<LoginResponseDto>("/member/login", dto);
  store.dispatch(setAccessToken(response.data.accessToken));
  store.dispatch(setMemberId(response.data.memberId));
  return response.data;
};

export const refreshToken = async (): Promise<LoginResponseDto> => {
  store.dispatch(loading());
  const response = await api.post<LoginResponseDto>("/member/reissue");
  store.dispatch(setAccessToken(response.data.accessToken));
  store.dispatch(setMemberId(response.data.memberId));
  return response.data;
};
