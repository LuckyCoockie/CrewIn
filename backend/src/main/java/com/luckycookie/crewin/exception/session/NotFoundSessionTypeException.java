package com.luckycookie.crewin.exception.session;

import static com.luckycookie.crewin.exception.constants.SessionExceptionList.NOT_FOUND_SESSION_TYPE_ERROR;

public class NotFoundSessionTypeException extends SessionException {
    public NotFoundSessionTypeException() {
        super(NOT_FOUND_SESSION_TYPE_ERROR.getErrorCode(),
                NOT_FOUND_SESSION_TYPE_ERROR.getHttpStatus(),
                NOT_FOUND_SESSION_TYPE_ERROR.getMessage());
    }
}
