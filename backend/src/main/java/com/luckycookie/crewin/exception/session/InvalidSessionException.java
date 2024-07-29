package com.luckycookie.crewin.exception.session;

import static com.luckycookie.crewin.exception.constants.SessionExceptionList.INVALID_SESSION;

public class InvalidSessionException extends SessionException {
    public InvalidSessionException() {
        super(INVALID_SESSION.getErrorCode(), INVALID_SESSION.getHttpStatus(), INVALID_SESSION.getMessage());
    }
}
