import { addInterceptor, removeInterceptor } from "../apis/modules/interecptor";
import {
  clearTokenInterceptors,
  setTokenInterceptors,
} from "../apis/utils/instance";
import Tmap from "../apis/api/tmap/instance";
import store from "../modules";
import { clearAccessToken, setAccessToken } from "../modules/reducers/auth";
import { debounce } from "lodash";

export const setAuth = debounce(
  (dto: { accessToken: string; memberId: number }) => {
    const currentTime = new Date().getTime().toString();
    localStorage.setItem("AUTH", currentTime);
    store.dispatch(setAccessToken(dto.accessToken, dto.memberId));
    store.dispatch(
      addInterceptor("auth", setTokenInterceptors(dto.accessToken))
    );
    store.dispatch(
      addInterceptor("tmap", Tmap.setTokenInterceptors(dto.accessToken))
    );
  },
  300
);

export const clearAuth = debounce((error?: string) => {
  localStorage.removeItem("AUTH");
  store.dispatch(clearAccessToken(error));
  store.dispatch(removeInterceptor("auth", clearTokenInterceptors));
  store.dispatch(removeInterceptor("tmap", Tmap.clearTokenInterceptors));
}, 300);

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
