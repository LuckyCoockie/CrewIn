package com.luckycookie.crewin.exception.session;

import static com.luckycookie.crewin.exception.constants.SessionExceptionList.SESSION_IN_PROGRESS;

public class SessionInProgressException extends SessionException {

    public SessionInProgressException() {
        super(SESSION_IN_PROGRESS.getErrorCode(), SESSION_IN_PROGRESS.getHttpStatus(), SESSION_IN_PROGRESS.getMessage());
    }
}
