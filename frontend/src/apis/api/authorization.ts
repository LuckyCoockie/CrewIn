import axios from "axios";
import store from "../../modules";
import { loading, setAccessToken } from "../../modules/reducers/auth";
import api from "../index";

export type LoginRequestDto = { email: string; password: string };
export type LoginResponseDto = { accessToken: string; memberId: number };

export const login = async (
  dto: LoginRequestDto
): Promise<LoginResponseDto> => {
  store.dispatch(loading());
  const response = await api.post<LoginResponseDto>("/member/login", dto);
  store.dispatch(
    setAccessToken(response.data.accessToken, response.data.memberId)
  );
  return response.data;
};

export const refreshToken = async (): Promise<LoginResponseDto> => {
  store.dispatch(loading());
  const response = await axios.post<LoginResponseDto>(
    `${import.meta.env.VITE_SERVER_URL}/member/reissue`,
    null,
    { withCredentials: true }
  );

  console.log("refresh success 1", response);

  store.dispatch(
    setAccessToken(response.data.accessToken, response.data.memberId)
  );
  return response.data;
};
