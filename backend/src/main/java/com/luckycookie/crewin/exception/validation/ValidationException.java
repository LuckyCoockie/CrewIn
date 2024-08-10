package com.luckycookie.crewin.exception.validation;

import com.luckycookie.crewin.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public abstract class ValidationException extends ApplicationException {
    protected ValidationException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
