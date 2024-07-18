package com.luckycookie.crewin.exception.image;

import com.luckycookie.crewin.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public abstract class ImageException extends ApplicationException {
    protected ImageException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
