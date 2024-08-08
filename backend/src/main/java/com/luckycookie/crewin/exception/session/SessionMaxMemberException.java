package com.luckycookie.crewin.exception.session;

import static com.luckycookie.crewin.exception.constants.SessionExceptionList.SESSION_MAX_MEMBER_ERROR;

public class SessionMaxMemberException extends SessionException{

    public SessionMaxMemberException() {
        super(SESSION_MAX_MEMBER_ERROR.getErrorCode(),
                SESSION_MAX_MEMBER_ERROR.getHttpStatus(),
                SESSION_MAX_MEMBER_ERROR.getMessage());
    }

}
