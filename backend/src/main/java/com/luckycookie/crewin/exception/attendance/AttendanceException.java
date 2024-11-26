package com.luckycookie.crewin.exception.attendance;

import com.luckycookie.crewin.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class AttendanceException extends ApplicationException {
    protected AttendanceException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
