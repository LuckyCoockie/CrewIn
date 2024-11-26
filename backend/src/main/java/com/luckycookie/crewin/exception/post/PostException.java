package com.luckycookie.crewin.exception.post;

import com.luckycookie.crewin.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public abstract class PostException extends ApplicationException {
    protected PostException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }

}
