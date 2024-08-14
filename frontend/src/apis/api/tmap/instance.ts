import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import ErrorResponseDto from "../../utils/errorCode/ErrorResponseDto";
import store from "../../../modules";
import { endLoading, loading } from "../../../modules/reducers/auth";
import { clearAuth, setAuth } from "../../../util/auth";
import {
  addCallback,
  clearCallback,
  runCallback,
} from "../../modules/callback";

const BASE_URL = import.meta.env.VITE_PROXY_URL;

export const api = axios.create({ baseURL: BASE_URL });

api.interceptors.response.use(
  (response: AxiosResponse) => {
    store.dispatch(endLoading());
    return response;
  },
  async (error: AxiosError<ErrorResponseDto>) => {
    if (error.response && error.response.status === 401) {
      if (store.getState().auth.loading) {
        return new Promise((resolve) => {
          const callback = (token: string) => {
            if (error.config?.headers) {
              error.config.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(error.config ?? {}));
          };
          store.dispatch(addCallback(callback));
        });
      }
      try {
        store.dispatch(loading());

        const response = await axios.post<{
          data: {
            accessToken: string;
            memberId: number;
          };
        }>(`${BASE_URL}/api/member/reissue`, null, { withCredentials: true });

        const { accessToken } = response.data.data;

        if (error.config?.headers) {
          error.config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        setAuth(response.data.data);
        runCallback(accessToken);

        return api(error.config ?? {});
      } catch (refreshError) {
        clearAuth();
        store.dispatch(clearCallback());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const setTokenInterceptors = (token: string) => {
  return api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    },
    (error: AxiosError<ErrorResponseDto>) => {
      return Promise.reject(error);
    }
  );
};

export const clearTokenInterceptors = (interceptorId: number) => {
  api.interceptors.request.eject(interceptorId);
};

export default { api, setTokenInterceptors, clearTokenInterceptors };
