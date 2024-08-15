import { addInterceptor, removeInterceptor } from "../apis/modules/interecptor";
import {
  clearTokenInterceptors,
  setTokenInterceptors,
} from "../apis/utils/instance";
import {
  setTokenInterceptors as setTmapTokenInterceptors,
  clearTokenInterceptors as clearTmapTokenInterceptors,
} from "../apis/api/tmap/instance";
import store from "../modules";
import { clearAccessToken, setAccessToken } from "../modules/reducers/auth";

export const setAuth = (
  dto: { accessToken: string; memberId: number },
  loading: boolean = true
) => {
  const currentTime = new Date().getTime().toString();
  localStorage.setItem("AUTH", currentTime);
  store.dispatch(setAccessToken(dto.accessToken, dto.memberId, loading));
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
      setTmapTokenInterceptors(dto.accessToken),
      clearTmapTokenInterceptors
    )
  );
};

export const clearAuth = (error?: string) => {
  localStorage.removeItem("AUTH");
  store.dispatch(clearAccessToken(error));
  store.dispatch(removeInterceptor("auth", clearTokenInterceptors));
  store.dispatch(removeInterceptor("tmap", clearTmapTokenInterceptors));
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
