package com.luckycookie.crewin.exception.attendance;

import static com.luckycookie.crewin.exception.constants.AttendanceExceptionList.INVALID_LOCATION;

public class InvalidLocationException extends AttendanceException {
    public InvalidLocationException() {
        super(INVALID_LOCATION.getErrorCode(), INVALID_LOCATION.getHttpStatus(), INVALID_LOCATION.getMessage());
    }
}
