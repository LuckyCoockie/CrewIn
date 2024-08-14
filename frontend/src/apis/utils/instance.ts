import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import ErrorResponseDto from "./errorCode/ErrorResponseDto";
import store from "../../modules";
import { loading, endLoading } from "../../modules/reducers/auth";
import { convertKeysToKebabCase } from "./querystring.ts/camelToKebab";
import { clearAuth, setAuth } from "../../util/auth";
import { addCallback, clearCallback, runCallback } from "../modules/callback";

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

api.interceptors.response.use(
  (response: AxiosResponse) => {
    store.dispatch(endLoading());
    return { ...response, data: response.data.data };
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
        }>(`${BASE_URL}/member/reissue`, null, { withCredentials: true });

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
  const interceptorId = api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    },
    (error: AxiosError<ErrorResponseDto>) => {
      return Promise.reject(error);
    }
  );
  return interceptorId;
};

export const clearTokenInterceptors = (interceptorId: number) => {
  api.interceptors.request.eject(interceptorId);
};

export default api;
