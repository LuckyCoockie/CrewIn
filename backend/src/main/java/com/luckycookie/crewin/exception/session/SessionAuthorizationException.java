package com.luckycookie.crewin.exception.session;

import static com.luckycookie.crewin.exception.constants.SessionExceptionList.SESSION_AUTHORIZATION_ERROR;

public class SessionAuthorizationException extends SessionException{
    public SessionAuthorizationException() {
        super(SESSION_AUTHORIZATION_ERROR.getErrorCode(),
                SESSION_AUTHORIZATION_ERROR.getHttpStatus(),
                SESSION_AUTHORIZATION_ERROR.getMessage());
    }
}
