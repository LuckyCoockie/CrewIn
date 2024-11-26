package com.luckycookie.crewin.exception.notification;


import com.luckycookie.crewin.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public abstract class NotificationException extends ApplicationException {
    protected NotificationException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
