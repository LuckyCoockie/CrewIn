import axios from "axios";
import store from "../../modules";
import { loading } from "../../modules/reducers/auth";
import { checkAuth, clearAuth, setAuth } from "../../util/auth";

export type LoginRequestDto = { email: string; password: string };
export type LoginResponseDto = { accessToken: string; memberId: number };

export const login = async (dto: LoginRequestDto) => {
  store.dispatch(loading());
  const response = await axios.post<{ data: LoginResponseDto }>(
    `${import.meta.env.VITE_SERVER_URL}/member/login`,
    dto
  );
  setAuth(response.data.data);
};

export const refreshToken = async () => {
  if (!checkAuth()) {
    clearAuth();
    throw "";
  }
  try {
    store.dispatch(loading());
    const response = await axios.post<{ data: LoginResponseDto }>(
      `${import.meta.env.VITE_SERVER_URL}/member/reissue`,
      null,
      { withCredentials: true }
    );
    setAuth(response.data.data);
  } catch (e) {
    clearAuth();
    throw "";
  }
};
