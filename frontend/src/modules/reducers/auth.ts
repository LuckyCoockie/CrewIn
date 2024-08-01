import { Dispatch } from "redux";
import { AxiosError } from "axios";
import {
  clearAxiosInterceptors,
  setupAxiosInterceptors,
} from "../../apis/utils/instance";
import * as api from "../../apis/api/authorization";
import { UNKNOWN_ERROR_MESSAGE } from "./util";

/* ----------------- 액션 타입 ------------------ */
const BASE_ACTION_TYPE = "api/auth";
export const LOGIN_REQUEST = `${BASE_ACTION_TYPE}/LOGIN_REQUEST`;
export const LOGIN_SUCCESS = `${BASE_ACTION_TYPE}/LOGIN_SUCCESS`;
export const LOGIN_FAILURE = `${BASE_ACTION_TYPE}/LOGIN_FAILURE`;
export const REFRESH_TOKEN_SUCCESS = `${BASE_ACTION_TYPE}/REFRESH_TOKEN_SUCCESS`;
export const REFRESH_TOKEN_FAILURE = `${BASE_ACTION_TYPE}/REFRESH_TOKEN_FAILURE`;

/* ----------------- 액션 ------------------ */
type LoginRequestAction = {
  type: typeof LOGIN_REQUEST;
};

type LoginSuccessAction = {
  type: typeof LOGIN_SUCCESS;
  payload: string; // access token
};

type LoginFailureAction = {
  type: typeof LOGIN_FAILURE;
  error: string;
};

type RefreshTokenSuccessAction = {
  type: typeof REFRESH_TOKEN_SUCCESS;
  payload: string; // new access token
};

type RefreshTokenFailureAction = {
  type: typeof REFRESH_TOKEN_FAILURE;
  error: string;
};

export type AuthActionTypes =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | RefreshTokenSuccessAction
  | RefreshTokenFailureAction;

/* ----------------- 액션 함수 ------------------ */
export const login = (email: string, password: string) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: LOGIN_REQUEST });

    try {
      const response = await api.login({ email: email, password: password });
      const { accessToken } = response;

      // axios interceptor 설정
      setupAxiosInterceptors(accessToken);

      dispatch({ type: LOGIN_SUCCESS, payload: accessToken });
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch({ type: LOGIN_FAILURE, error: error.response?.data.message });
      } else {
        dispatch({ type: LOGIN_FAILURE, error: UNKNOWN_ERROR_MESSAGE });
      }
    }
  };
};

export const refreshAccessToken = () => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    try {
      const response = await api.refreshAccessToken();
      const { accessToken } = response;

      setupAxiosInterceptors(accessToken);

      dispatch({ type: REFRESH_TOKEN_SUCCESS, payload: accessToken });
      return accessToken;
    } catch (error) {
      clearAxiosInterceptors();
      if (error instanceof AxiosError) {
        dispatch({ type: LOGIN_FAILURE, error: error.response?.data.message });
      } else {
        dispatch({ type: LOGIN_FAILURE, error: UNKNOWN_ERROR_MESSAGE });
      }
      throw error;
    }
  };
};

/* ----------------- 모듈 상태 타입 ------------------ */
type AuthState = {
  accessToken: string | null;
  loading: boolean;
  error: string | null;
};

/* ----------------- 모듈의 초기 상태 ------------------ */
const initialState: AuthState = {
  accessToken: null,
  loading: false,
  error: null,
};

/* ----------------- 리듀서 ------------------ */
const authReducer = (
  state = initialState,
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        accessToken: action.payload,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        accessToken: null,
        error: action.error,
      };
    case REFRESH_TOKEN_SUCCESS:
      return { ...state, accessToken: action.payload };
    case REFRESH_TOKEN_FAILURE:
      return { ...state, accessToken: null, error: action.error };
    default:
      return state;
  }
};

export default authReducer;
