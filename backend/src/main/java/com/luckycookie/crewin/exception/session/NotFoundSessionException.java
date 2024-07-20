package com.luckycookie.crewin.exception.session;

import org.springframework.http.HttpStatus;

import static com.luckycookie.crewin.exception.constants.SessionExceptionList.NOT_FOUND_SESSION_ERROR;

public class NotFoundSessionException extends SessionException{
    protected NotFoundSessionException() {
        super(NOT_FOUND_SESSION_ERROR.getErrorCode(),
                NOT_FOUND_SESSION_ERROR.getHttpStatus(),
                NOT_FOUND_SESSION_ERROR.getMessage());
    }
}
