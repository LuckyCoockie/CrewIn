import store from "../modules";
import { clearAccessToken, setAccessToken } from "../modules/reducers/auth";

export const setAuth = (dto: { accessToken: string; memberId: number }) => {
  const currentTime = new Date().getTime().toString();
  localStorage.setItem("AUTH", currentTime);
  store.dispatch(setAccessToken(dto.accessToken, dto.memberId));
};

export const clearAuth = () => {
  localStorage.removeItem("AUTH");
  store.dispatch(clearAccessToken());
};

export const checkAuth = (): boolean => {
  if (!localStorage.getItem("AUTH")) return false;
  const authTime = parseInt(localStorage.getItem("AUTH")!);
  const currentTime = new Date().getTime();
  if (currentTime - authTime >= 1000 * 60 * 60 * 24 * 7) {
    clearAuth();
    return false;
  }
  return true;
};
