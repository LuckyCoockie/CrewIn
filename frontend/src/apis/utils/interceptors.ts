import { AxiosError, AxiosResponse } from "axios";
import api, { setupAxiosInterceptors } from "./instance";
import ErrorResponseDto from "./errorCode/ErrorResponseDto";
import Unauthorized from "./errorCode/Unauthorized";
import store from "../../modules";
import { refreshAccessToken } from "../../modules/reducers/auth";

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ErrorResponseDto>) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data["errorCode"] === Unauthorized.EXPIRED_ACCESS_TOKEN
    ) {
      try {
        const token = await store.dispatch(refreshAccessToken());

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
