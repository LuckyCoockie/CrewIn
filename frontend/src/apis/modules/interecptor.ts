/* ----------------- 액션 타입 ------------------ */
const BASE_ACTION_TYPE = "api/interceptor";
export const ADD_INTERCEPTOR = `${BASE_ACTION_TYPE}/ADD_INTERCEPTOR`;
export const REMOVE_INTERCEPTOR = `${BASE_ACTION_TYPE}/REMOVE_INTERCEPTOR`;
export const CLEAR_INTERCEPTOR = `${BASE_ACTION_TYPE}/CLEAR_INTERCEPTOR`;

/* ----------------- 액션 ------------------ */
type AddInterceptorAction = {
  type: typeof ADD_INTERCEPTOR;
  key: string;
  interceptor: number;
  onRemove: (interceptor: number) => void;
};

type RemoveInterceptorAction = {
  type: typeof REMOVE_INTERCEPTOR;
  key: string;
  callback: (interceptor: number) => void;
};

export type InterceptorActionType =
  | AddInterceptorAction
  | RemoveInterceptorAction;

/* ----------------- 액션 함수 ------------------ */
export const addInterceptor = (
  key: string,
  interceptor: number,
  onRemove: (interceptor: number) => void
): AddInterceptorAction => ({
  type: ADD_INTERCEPTOR,
  key: key,
  interceptor: interceptor,
  onRemove: onRemove,
});

export const removeInterceptor = (
  key: string,
  callback: (interceptor: number) => void
): RemoveInterceptorAction => ({
  type: REMOVE_INTERCEPTOR,
  key: key,
  callback: callback,
});

/* ----------------- 모듈 상태 타입 ------------------ */
type InterceptorState = {
  interceptors: Map<string, number>;
};

/* ----------------- 모듈의 초기 상태 ------------------ */
const initialState: InterceptorState = {
  interceptors: new Map(),
};

/* ----------------- 리듀서 ------------------ */
const interceptorReducer = (
  state = initialState,
  action: InterceptorActionType
): InterceptorState => {
  switch (action.type) {
    case ADD_INTERCEPTOR: {
      const interceptor = state.interceptors.get(action.key);
      if (interceptor !== undefined) action.onRemove(interceptor);
      state.interceptors.set(action.key, action.interceptor);
      return { interceptors: state.interceptors };
    }
    case REMOVE_INTERCEPTOR: {
      const interceptor = state.interceptors.get(action.key);
      if (interceptor === undefined) return state;
      action.callback(interceptor);
      state.interceptors.delete(action.key);
      return { interceptors: state.interceptors };
    }
    default:
      return state;
  }
};

export default interceptorReducer;
