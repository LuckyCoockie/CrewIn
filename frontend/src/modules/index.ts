import { applyMiddleware, combineReducers, createStore } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./reducers/auth";
import interceptorReducer from "../apis/modules/interecptor";

const rootReducer = combineReducers({
  auth: authReducer,
  interceptor: interceptorReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
const store = createStore(rootReducer, {}, applyMiddleware(thunk));
export default store;
