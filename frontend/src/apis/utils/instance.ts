import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import ErrorResponseDto from "./errorCode/ErrorResponseDto";
import store from "../../modules";
import { loading } from "../../modules/reducers/auth";
import { convertKeysToKebabCase } from "./querystring.ts/camelToKebab";
import { clearAuth, setAuth } from "../../util/auth";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.params) {
    config.params = convertKeysToKebabCase(config.params);
  }
  return config;
});

api.interceptors.response.use((response: AxiosResponse) => {
  return { ...response, data: response.data.data };
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ErrorResponseDto>) => {
    if (error.response && error.response.status === 401) {
      try {
        store.dispatch(loading());

        const response = await axios.post<{
          data: {
            accessToken: string;
            memberId: number;
          };
        }>(`${BASE_URL}/member/reissue`, null, { withCredentials: true });

        setAuth(response.data.data);

        const { accessToken } = response.data.data;

        if (error.config?.headers) {
          error.config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return api(error.config ?? {});
      } catch (refreshError) {
        clearAuth();
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

export default api;
