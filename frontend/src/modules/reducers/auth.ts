import { Dispatch } from "redux";

/* ----------------- 액션 타입 ------------------ */
const BASE_ACTION_TYPE = "api/auth";
export const LOADING = `${BASE_ACTION_TYPE}/LOADING`;
export const SET_ACCESS_TOKEN = `${BASE_ACTION_TYPE}/SET_ACCESS_TOKEN`;
export const CLEAR_ACCESS_TOKEN = `${BASE_ACTION_TYPE}/CLEAR_ACCESS_TOKEN`;
export const END_LOADING = `${BASE_ACTION_TYPE}/END_LOADING`;

/* ----------------- 액션 ------------------ */
type Loading = {
  type: typeof LOADING;
};

type SetAccessTokenAction = {
  type: typeof SET_ACCESS_TOKEN;
  accessToken: string;
  memberId: number;
};

type ClearAccessTokenAction = {
  type: typeof CLEAR_ACCESS_TOKEN;
  error?: string;
};

type EndLoadingAction = {
  type: typeof END_LOADING;
};

export type AuthActionTypes =
  | Loading
  | SetAccessTokenAction
  | ClearAccessTokenAction
  | EndLoadingAction;

/* ----------------- 액션 함수 ------------------ */
export const loading = (): Loading => ({
  type: LOADING,
});

export const setAccessToken = (accessToken: string, memberId: number) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({
      type: SET_ACCESS_TOKEN,
      accessToken: accessToken,
      memberId: memberId,
    });
  };
};

export const clearAccessToken = (error?: string) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: CLEAR_ACCESS_TOKEN, error: error });
  };
};

export const endLoading = (): EndLoadingAction => ({
  type: END_LOADING,
});
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
      };
    case CLEAR_ACCESS_TOKEN: {
      return {
        memberId: null,
        accessToken: null,
        loading: false,
        error: action.error,
      };
    }
    case END_LOADING:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default authReducer;
