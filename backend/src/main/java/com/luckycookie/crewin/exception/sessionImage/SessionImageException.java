package com.luckycookie.crewin.exception.sessionImage;

import com.luckycookie.crewin.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class SessionImageException extends ApplicationException {
    protected SessionImageException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
