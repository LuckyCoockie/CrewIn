import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import ErrorResponseDto from "./errorCode/ErrorResponseDto";
import Unauthorized from "./errorCode/Unauthorized";
import store from "../../modules";
import {
  clearAccessToken,
  loading,
  setAccessToken,
} from "../../modules/reducers/auth";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use((response: AxiosResponse) => {
  return { ...response, data: response.data.data };
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ErrorResponseDto>) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data["errorCode"] !== Unauthorized.INVALID_LOGIN
    ) {
      try {
        store.dispatch(loading());

        const response = await api.post<{ accessToken: string }>(
          `/member/reissue`
        );
        const { accessToken } = response.data;

        store.dispatch(setAccessToken(accessToken));

        if (error.config?.headers) {
          error.config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return api(error.config ?? {});
      } catch (refreshError) {
        store.dispatch(clearAccessToken(error.response?.data.message));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const setupAxiosInterceptors = (token: string) => {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    },
    (error: AxiosError<ErrorResponseDto>) => {
      return Promise.reject(error);
    }
  );
};

export const clearAxiosInterceptors = () => {
  api.interceptors.request.clear();
};

export default api;
