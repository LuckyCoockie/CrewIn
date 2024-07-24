package com.luckycookie.crewin.exception.member;

import static com.luckycookie.crewin.exception.constants.MemberExceptionList.EMAIL_NOT_FOUND;

public class EmailNotFoundException extends MemberException {
    public EmailNotFoundException() {
        super(EMAIL_NOT_FOUND.getErrorCode(), EMAIL_NOT_FOUND.getHttpStatus(), EMAIL_NOT_FOUND.getMessage());
    }
}
