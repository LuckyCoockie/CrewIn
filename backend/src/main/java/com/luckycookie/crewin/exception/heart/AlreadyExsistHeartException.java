package com.luckycookie.crewin.exception.heart;

import static com.luckycookie.crewin.exception.constants.HeartExceptionList.ALREADY_EXSIST_HEART_ERROR;

public class AlreadyExsistHeartException extends HeartException{
    public AlreadyExsistHeartException() {
        super(ALREADY_EXSIST_HEART_ERROR.getErrorCode(), ALREADY_EXSIST_HEART_ERROR.getHttpStatus(), ALREADY_EXSIST_HEART_ERROR.getMessage());
    }
}
