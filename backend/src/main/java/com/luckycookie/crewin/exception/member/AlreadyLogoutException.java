package com.luckycookie.crewin.exception.member;

import static com.luckycookie.crewin.exception.constants.MemberExceptionList.ALREADY_LOGOUT_ERROR;

public class AlreadyLogoutException extends MemberException {
    public AlreadyLogoutException() {
        super(ALREADY_LOGOUT_ERROR.getErrorCode(), ALREADY_LOGOUT_ERROR.getHttpStatus(), ALREADY_LOGOUT_ERROR.getMessage());
    }
}
