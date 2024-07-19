import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Unauthorized from "./errorCode/Unauthorized";
import ErrorResponse from "./errorCode/ErrorResponse";

let token: string | null = "";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const setToken = (newToken: string) => {
  token = newToken;
};

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError<ErrorResponse>) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data["errorCode"] === Unauthorized.EXPIRED_ACCESS_TOKEN
    ) {
      try {
        const response = await api.post(
          `/user/reissue`,
          {},
          { withCredentials: true }
        );
        const newToken = response.data.token;
        setToken(newToken);

        if (error.config?.headers) {
          error.config.headers.Authorization = `Bearer ${token}`;
        }
        return api(error.config ?? {});
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
