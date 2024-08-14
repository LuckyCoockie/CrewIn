import { addInterceptor, removeInterceptor } from "../apis/modules/interecptor";
import {
  clearTokenInterceptors,
  setTokenInterceptors,
} from "../apis/utils/instance";
import Tmap from "../apis/api/tmap/instance";
import store from "../modules";
import { clearAccessToken, setAccessToken } from "../modules/reducers/auth";
import { debounce } from "lodash";

export const setAuth = (dto: { accessToken: string; memberId: number }) => {
  console.log("setAuth");
  const currentTime = new Date().getTime().toString();
  localStorage.setItem("AUTH", currentTime);
  store.dispatch(setAccessToken(dto.accessToken, dto.memberId));
  store.dispatch(
    addInterceptor(
      "auth",
      setTokenInterceptors(dto.accessToken),
      clearTokenInterceptors
    )
  );
  store.dispatch(
    addInterceptor(
      "tmap",
      Tmap.setTokenInterceptors(dto.accessToken),
      Tmap.clearTokenInterceptors
    )
  );
};

export const clearAuth = (error?: string) => {
  console.log("clearAuth");
  localStorage.removeItem("AUTH");
  store.dispatch(clearAccessToken(error));
  store.dispatch(removeInterceptor("auth", clearTokenInterceptors));
  store.dispatch(removeInterceptor("tmap", Tmap.clearTokenInterceptors));
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
