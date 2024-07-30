import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import ErrorResponseDto from "./errorCode/ErrorResponseDto";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.response.use((response: AxiosResponse) => {
  return { ...response, data: response.data.data };
});

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

setupAxiosInterceptors(
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0MTIzNEB0ZXN0LmNvbSIsImlhdCI6MTcyMjMxODMzNiwiZW1haWwiOiJ0ZXN0MTIzNEB0ZXN0LmNvbSIsImV4cCI6MTcyNDkxMDMzNn0.87BHcZy0Fd38yfJ0GkXe2woDZrVSpkNuzbCe3RFHmpPuqOHBnVbrGFVLG3as_BvmduiXD1xiOR5mOrmFBJsFtQ"
);

export const clearAxiosInterceptors = () => {
  api.interceptors.request.clear();
};

export default api;
