import { Dispatch } from "redux";
import {
  clearAxiosInterceptors,
  setupAxiosInterceptors,
} from "../../apis/utils/instance";

/* ----------------- 액션 타입 ------------------ */
const BASE_ACTION_TYPE = "api/auth";
export const LOADING = `${BASE_ACTION_TYPE}/LOADING`;
export const SET_ACCESS_TOKEN = `${BASE_ACTION_TYPE}/SET_ACCESS_TOKEN`;
export const CLEAR_ACCESS_TOKEN = `${BASE_ACTION_TYPE}/CLEAR_ACCESS_TOKEN`;
export const SET_MEMBER_ID = `${BASE_ACTION_TYPE}/SET_MEMBER_ID`;

/* ----------------- 액션 ------------------ */
type Loading = {
  type: typeof LOADING;
};

type SetAccessTokenAction = {
  type: typeof SET_ACCESS_TOKEN;
  accessToken: string; // access token
};

type ClearAccessTokenAction = {
  type: typeof CLEAR_ACCESS_TOKEN;
  error?: string;
};

type SetMemberIdAction = {
  type: typeof SET_MEMBER_ID;
  memberId: number; // member id
};

export type AuthActionTypes =
  | Loading
  | SetAccessTokenAction
  | ClearAccessTokenAction
  | SetMemberIdAction;

/* ----------------- 액션 함수 ------------------ */
export const loading = () => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: LOADING });
  };
};

export const setAccessToken = (accessToken: string) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: SET_ACCESS_TOKEN, accessToken: accessToken });
    setupAxiosInterceptors(accessToken);
  };
};

export const clearAccessToken = (error?: string) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: CLEAR_ACCESS_TOKEN, error: error });
    clearAxiosInterceptors();
  };
};

export const setMemberId = (memberId: number) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: SET_MEMBER_ID, memberId: memberId });
  };
};

/* ----------------- 모듈 상태 타입 ------------------ */
type AuthState = {
  accessToken: string | null;
  memberId: number | null;
  loading: boolean;
  error?: string;
};

/* ----------------- 모듈의 초기 상태 ------------------ */
const initialState: AuthState = {
  accessToken: null,
  memberId: 1, // TODO: memberId null 처리해야 타 계정 로그인 가능 
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
      return { ...state, accessToken: action.accessToken, loading: false };
    case CLEAR_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: null,
        memberId: null,
        loading: false,
        error: action.error,
      };
    case SET_MEMBER_ID:
      return { ...state, memberId: action.memberId };
    default:
      return state;
  }
};

export default authReducer;
