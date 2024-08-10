import { Dispatch } from "redux";
import {
  clearTokenInterceptors,
  setTokenInterceptors,
} from "../../apis/utils/instance";

/* ----------------- 액션 타입 ------------------ */
const BASE_ACTION_TYPE = "api/auth";
export const LOADING = `${BASE_ACTION_TYPE}/LOADING`;
export const SET_ACCESS_TOKEN = `${BASE_ACTION_TYPE}/SET_ACCESS_TOKEN`;
export const CLEAR_ACCESS_TOKEN = `${BASE_ACTION_TYPE}/CLEAR_ACCESS_TOKEN`;

/* ----------------- 액션 ------------------ */
type Loading = {
  type: typeof LOADING;
};

type SetAccessTokenAction = {
  type: typeof SET_ACCESS_TOKEN;
  accessToken: string;
  memberId: number;
  interceptorId: number;
};

type ClearAccessTokenAction = {
  type: typeof CLEAR_ACCESS_TOKEN;
  error?: string;
};

export type AuthActionTypes =
  | Loading
  | SetAccessTokenAction
  | ClearAccessTokenAction;

/* ----------------- 액션 함수 ------------------ */
export const loading = (): Loading => ({
  type: LOADING,
});

export const setAccessToken = (accessToken: string, memberId: number) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    const interceptorId = setTokenInterceptors(accessToken);
    dispatch({
      type: SET_ACCESS_TOKEN,
      accessToken: accessToken,
      memberId: memberId,
      interceptorId: interceptorId,
    });
  };
};

export const clearAccessToken = (error?: string) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: CLEAR_ACCESS_TOKEN, error: error });
  };
};

/* ----------------- 모듈 상태 타입 ------------------ */
type AuthState = {
  accessToken: string | null;
  memberId: number | null;
  interceptorId: number | null;
  loading: boolean;
  error?: string;
};

/* ----------------- 모듈의 초기 상태 ------------------ */
const initialState: AuthState = {
  accessToken: null,
  interceptorId: null,
  memberId: null,
  loading: false,
};

/* ----------------- 리듀서 ------------------ */
const authReducer = (
  state = initialState,
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case LOADING:
      return { ...state, loading: true };
    case SET_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.accessToken,
        memberId: action.memberId,
        loading: false,
      };
    case CLEAR_ACCESS_TOKEN: {
      if (state.interceptorId) {
        clearTokenInterceptors(state.interceptorId);
      }
      return {
        interceptorId: null,
        memberId: null,
        accessToken: null,
        loading: false,
        error: action.error,
      };
    }
    default:
      return state;
  }
};

export default authReducer;
