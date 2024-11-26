package com.luckycookie.crewin.exception.member;

import static com.luckycookie.crewin.exception.constants.MemberExceptionList.EMAIL_SEND_ERROR;

public class EmailSendException extends MemberException {
    public EmailSendException() {
        super(EMAIL_SEND_ERROR.getErrorCode(), EMAIL_SEND_ERROR.getHttpStatus(), EMAIL_SEND_ERROR.getMessage());
    }
}