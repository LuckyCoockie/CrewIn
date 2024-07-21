import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import ErrorResponseDto from "./errorCode/ErrorResponseDto";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const api = axios.create({ baseURL: BASE_URL });

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
