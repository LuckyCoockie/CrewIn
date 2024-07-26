package com.luckycookie.crewin.exception.member;

import com.luckycookie.crewin.exception.ApplicationException;

import static com.luckycookie.crewin.exception.constants.MemberExceptionList.NAME_EMAIL_MISMATCH;

public class NameEmailMismatchException extends ApplicationException {
    public NameEmailMismatchException() {
        super(NAME_EMAIL_MISMATCH.getErrorCode(), NAME_EMAIL_MISMATCH.getHttpStatus(), NAME_EMAIL_MISMATCH.getMessage());
    }
}
