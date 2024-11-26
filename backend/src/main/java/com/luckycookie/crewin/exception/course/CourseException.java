package com.luckycookie.crewin.exception.course;

import com.luckycookie.crewin.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public abstract class CourseException extends ApplicationException {
    protected CourseException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
