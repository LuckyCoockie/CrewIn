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
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0MTIzNEB0ZXN0LmNvbSIsImlhdCI6MTcyMTcwNjUzMywiZW1haWwiOiJ0ZXN0MTIzNEB0ZXN0LmNvbSIsImV4cCI6MTcyNDI5ODUzM30.F36pmENzLcmqw7OZGRuV1dnMYLfoJwjfSTv7CRC90MbO7B_J8I6vZLCabBYdJnAGw6XEwH2QXbSQsfnyk_itew"
);

export const clearAxiosInterceptors = () => {
  api.interceptors.request.clear();
};

export default api;
