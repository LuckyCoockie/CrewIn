import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import ErrorResponseDto from "./errorCode/ErrorResponseDto";
// import Unauthorized from "./errorCode/Unauthorized";
// import store from "../../modules";
// import {
//   clearAccessToken,
//   loading,
//   setAccessToken,
// } from "../../modules/reducers/auth";
import { convertKeysToKebabCase } from "./querystring.ts/camelToKebab";

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

// api.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response;
//   },
//   async (error: AxiosError<ErrorResponseDto>) => {
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       error.response.data["errorCode"] !== Unauthorized.INVALID_LOGIN
//     ) {
//       try {
//         store.dispatch(loading());

//         const response = await axios.post<{
//           accessToken: string;
//           memberId: number;
//         }>(`${BASE_URL}/member/reissue`, null, { withCredentials: true });
//         const { accessToken, memberId } = response.data;

//         store.dispatch(setAccessToken(accessToken, memberId));

//         if (error.config?.headers) {
//           error.config.headers.Authorization = `Bearer ${accessToken}`;
//         }

//         return api(error.config ?? {});
//       } catch (refreshError) {
//         store.dispatch(clearAccessToken(error.response?.data.message));
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

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
