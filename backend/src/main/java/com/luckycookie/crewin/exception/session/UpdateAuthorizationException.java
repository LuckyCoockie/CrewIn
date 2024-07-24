package com.luckycookie.crewin.exception.session;

import static com.luckycookie.crewin.exception.constants.SessionExceptionList.UPDATE_AUTHORIZATION_ERROR;

public class UpdateAuthorizationException extends SessionException{
    public UpdateAuthorizationException() {
        super(UPDATE_AUTHORIZATION_ERROR.getErrorCode(),
                UPDATE_AUTHORIZATION_ERROR.getHttpStatus(),
                UPDATE_AUTHORIZATION_ERROR.getMessage());
    }
}
