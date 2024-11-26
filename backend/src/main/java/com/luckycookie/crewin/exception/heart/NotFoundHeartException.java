package com.luckycookie.crewin.exception.heart;

import static com.luckycookie.crewin.exception.constants.HeartExceptionList.NOT_FOUND_HEART_ERROR;

public class NotFoundHeartException extends HeartException{
    public NotFoundHeartException() {
        super(NOT_FOUND_HEART_ERROR.getErrorCode(), NOT_FOUND_HEART_ERROR.getHttpStatus(), NOT_FOUND_HEART_ERROR.getMessage());
    }
}
