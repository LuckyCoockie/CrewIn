package com.luckycookie.crewin.exception.security;

import com.luckycookie.crewin.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class SecurityException extends ApplicationException {
    protected SecurityException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
