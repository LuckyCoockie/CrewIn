import store from "../../modules";
import { loading, setAccessToken } from "../../modules/reducers/auth";
import api from "../index";

export type LoginRequestDto = { email: string; password: string };
export type LoginResponseDto = { accessToken: string };

export const login = async (
  dto: LoginRequestDto
): Promise<LoginResponseDto> => {
  store.dispatch(loading());
  const response = await api.post<LoginResponseDto>("/member/login", dto);
  store.dispatch(setAccessToken(response.data.accessToken));
  return response.data;
};
