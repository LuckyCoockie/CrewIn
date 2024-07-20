package com.luckycookie.crewin.exception.member;

import static com.luckycookie.crewin.exception.constants.MemberExceptionList.LOGIN_FAIL;

public class LoginFailException extends MemberException {
    public LoginFailException() {
        super(
                LOGIN_FAIL.getErrorCode(),
                LOGIN_FAIL.getHttpStatus(),
                LOGIN_FAIL.getMessage()
        );
    }
}
