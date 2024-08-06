package com.luckycookie.crewin.exception.heart;

import com.luckycookie.crewin.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public abstract class HeartException extends ApplicationException {
    protected HeartException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
