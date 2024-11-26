package com.luckycookie.crewin.exception.member;

import com.luckycookie.crewin.exception.ApplicationException;

import static com.luckycookie.crewin.exception.constants.MemberExceptionList.INVALID_CREDENTIAL;

public class InvalidCredentialException extends ApplicationException {
    public InvalidCredentialException() {
        super(INVALID_CREDENTIAL.getErrorCode(), INVALID_CREDENTIAL.getHttpStatus(), INVALID_CREDENTIAL.getMessage());
    }
}
