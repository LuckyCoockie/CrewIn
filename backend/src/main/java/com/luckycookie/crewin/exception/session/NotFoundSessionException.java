package com.luckycookie.crewin.exception.session;



import static com.luckycookie.crewin.exception.constants.SessionExceptionList.NOT_FOUND_SESSION_ERROR;

public class NotFoundSessionException extends SessionException{
    public NotFoundSessionException() {
        super(NOT_FOUND_SESSION_ERROR.getErrorCode(),
                NOT_FOUND_SESSION_ERROR.getHttpStatus(),
                NOT_FOUND_SESSION_ERROR.getMessage());
    }
}
