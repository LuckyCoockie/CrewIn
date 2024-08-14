import { applyMiddleware, combineReducers, createStore } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./reducers/auth";
import interceptorReducer from "../apis/modules/interecptor";
import callbackReducer from "../apis/modules/callback";

const rootReducer = combineReducers({
  auth: authReducer,
  interceptor: interceptorReducer,
  refreshQueue: callbackReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
const store = createStore(rootReducer, {}, applyMiddleware(thunk));
export default store;
