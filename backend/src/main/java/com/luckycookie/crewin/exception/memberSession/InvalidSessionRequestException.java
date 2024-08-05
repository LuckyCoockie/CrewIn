package com.luckycookie.crewin.exception.memberSession;


import static com.luckycookie.crewin.exception.constants.MemberSessionExceptionList.INVALID_SESSION_REQUEST_ERROR;

public class InvalidSessionRequestException extends MemberSessionException {
    public InvalidSessionRequestException() {
        super(INVALID_SESSION_REQUEST_ERROR.getErrorCode(), INVALID_SESSION_REQUEST_ERROR.getHttpStatus(), INVALID_SESSION_REQUEST_ERROR.getMessage());
    }
}
