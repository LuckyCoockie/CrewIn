type Callback = (token: string) => void;

/* ----------------- 액션 타입 ------------------ */
const BASE_ACTION_TYPE = "api/callback";
export const ADD_CALLBACK = `${BASE_ACTION_TYPE}/ADD`;
export const RUN_CALLBACK = `${BASE_ACTION_TYPE}/RUN_CALLBACK`;
export const CLEAR_CALLBACK = `${BASE_ACTION_TYPE}/CLEAR`;

/* ----------------- 액션 ------------------ */
type AddCallbackAction = {
  type: typeof ADD_CALLBACK;
  callback: Callback;
};

type RunCallbackAction = {
  type: typeof RUN_CALLBACK;
  token: string;
};

type ClearCallbackAction = {
  type: typeof CLEAR_CALLBACK;
};

export type RefreshQueueActionType =
  | AddCallbackAction
  | RunCallbackAction
  | ClearCallbackAction;

/* ----------------- 액션 함수 ------------------ */
export const addCallback = (callback: Callback): AddCallbackAction => ({
  type: ADD_CALLBACK,
  callback: callback,
});

export const runCallback = (token: string): RunCallbackAction => ({
  type: RUN_CALLBACK,
  token: token,
});

export const clearCallback = (): ClearCallbackAction => ({
  type: CLEAR_CALLBACK,
});

/* ----------------- 모듈 상태 타입 ------------------ */
type RefreshQueue = {
  queue: Callback[];
};

/* ----------------- 모듈의 초기 상태 ------------------ */
const initialState: RefreshQueue = {
  queue: [],
};

/* ----------------- 리듀서 ------------------ */
const callbackReducer = (
  state = initialState,
  action: RefreshQueueActionType
): RefreshQueue => {
  switch (action.type) {
    case ADD_CALLBACK: {
      state.queue.push(action.callback);
      return { queue: state.queue };
    }
    case RUN_CALLBACK: {
      state.queue.forEach((callback) => callback(action.token));
      return { queue: [] };
    }
    case CLEAR_CALLBACK: {
      return { queue: [] };
    }
    default:
      return state;
  }
};

export default callbackReducer;
