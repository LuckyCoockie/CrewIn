import api from "../index";
import { setToken } from "../utils/instance";

export type LoginRequestDto = { email: string; password: string };

export const LoginApi = async ({ email, password }: LoginRequestDto) => {
  const response = await api.post("/login", {
    email: email,
    password: password,
  });
  setToken(response.data.token);
};
