package com.luckycookie.crewin.exception.attendance;

import static com.luckycookie.crewin.exception.constants.AttendanceExceptionList.INVALID_REQUEST_TIME;

public class InvalidRequestTimeException extends AttendanceException {
    public InvalidRequestTimeException() {
        super(INVALID_REQUEST_TIME.getErrorCode(), INVALID_REQUEST_TIME.getHttpStatus(), INVALID_REQUEST_TIME.getMessage());
    }
}
