package com.luckycookie.crewin.exception.security;


import static com.luckycookie.crewin.exception.constants.SecurityExceptionList.EXPIRED_TOKEN;

public class ExpiredTokenException extends SecurityException {
    public ExpiredTokenException() {
        super(EXPIRED_TOKEN.getErrorCode(), EXPIRED_TOKEN.getHttpStatus(), EXPIRED_TOKEN.getMessage());
    }
}
