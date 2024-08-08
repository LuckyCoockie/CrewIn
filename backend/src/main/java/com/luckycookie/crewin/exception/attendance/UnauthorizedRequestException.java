package com.luckycookie.crewin.exception.attendance;

import static com.luckycookie.crewin.exception.constants.AttendanceExceptionList.UNAUTHORIZED_REQUEST;

public class UnauthorizedRequestException extends AttendanceException {
    public UnauthorizedRequestException() {
        super(UNAUTHORIZED_REQUEST.getErrorCode(), UNAUTHORIZED_REQUEST.getHttpStatus(), UNAUTHORIZED_REQUEST.getMessage());
    }
}
