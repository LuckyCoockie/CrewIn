package com.luckycookie.crewin.exception.security;


import static com.luckycookie.crewin.exception.constants.SecurityExceptionList.INVALID_TOKEN;

public class InvalidTokenException extends SecurityException {
    public InvalidTokenException() {
        super(INVALID_TOKEN.getErrorCode(), INVALID_TOKEN.getHttpStatus(), INVALID_TOKEN.getMessage());
    }
}
