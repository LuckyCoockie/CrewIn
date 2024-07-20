package com.luckycookie.crewin.exception.session;

import com.luckycookie.crewin.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class SessionException extends ApplicationException {
    protected SessionException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
