import { Dispatch } from "react";
import * as api from "../../apis/api/presigned";
import { UNKNOWN_ERROR_MESSAGE } from "./util";
import { AxiosError } from "axios";

/* ----------------- 액션 타입 ------------------ */
const BASE_ACTION_TYPE = "api/presigned";
export const PRESIGNED_REQUEST = `${BASE_ACTION_TYPE}/PRESIGNED_REQUEST`;
export const PRESIGNED_SUCCESS = `${BASE_ACTION_TYPE}/PRESIGNED_SUCCESS`;
export const PRESIGNED_FAILURE = `${BASE_ACTION_TYPE}/PRESIGNED_FAILURE`;

/* ----------------- 액션 ------------------ */
type PresignedRequestAction = {
  type: typeof PRESIGNED_REQUEST;
};

type PresignedSuccessAction = {
  type: typeof PRESIGNED_SUCCESS;
};

type PresignedFailureAction = {
  type: typeof PRESIGNED_FAILURE;
  error: string;
};

export type AuthActionTypes =
  | PresignedRequestAction
  | PresignedSuccessAction
  | PresignedFailureAction;

/* ----------------- 액션 함수 ------------------ */
export const login = (type: "jpg" | "jpeg" | "png") => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: PRESIGNED_REQUEST });

    try {
      const response = await api.requestPresignedUrl({ imageExtension: type });
      dispatch({ type: PRESIGNED_SUCCESS });
      return response.presignedUrl;
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch({
          type: PRESIGNED_FAILURE,
          error: error.response?.data.message,
        });
      } else {
        dispatch({ type: PRESIGNED_FAILURE, error: UNKNOWN_ERROR_MESSAGE });
      }
    }
  };
};