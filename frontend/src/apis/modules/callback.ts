type Callback = (token: string) => void;

/* ----------------- 액션 타입 ------------------ */
const BASE_ACTION_TYPE = "api/callback";
export const ADD = `${BASE_ACTION_TYPE}/ADD`;
export const RUN_CALLBACK = `${BASE_ACTION_TYPE}/RUN_CALLBACK`;
export const CLEAR = `${BASE_ACTION_TYPE}/CLEAR`;

/* ----------------- 액션 ------------------ */
type AddAction = {
  type: typeof ADD;
  callback: Callback;
};

type RunCallbackAction = {
  type: typeof RUN_CALLBACK;
  token: string;
};

type ClearAction = {
  type: typeof CLEAR;
};

export type RefreshQueueActionType =
  | AddAction
  | RunCallbackAction
  | ClearAction;

/* ----------------- 액션 함수 ------------------ */
export const addCallback = (callback: Callback): AddAction => ({
  type: ADD,
  callback: callback,
});

export const runCallback = (token: string): RunCallbackAction => ({
  type: RUN_CALLBACK,
  token: token,
});

export const clearCallback = (): ClearAction => ({
  type: CLEAR,
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
    case ADD: {
      state.queue.push(action.callback);
      return { queue: state.queue };
    }
    case RUN_CALLBACK: {
      console.log(`RUN_CALLBACK : ${state.queue.length}`);
      state.queue.forEach((callback) => callback(action.token));
      return { queue: [] };
    }
    case CLEAR: {
      return { queue: [] };
    }
    default:
      return state;
  }
};

export default callbackReducer;
