package com.luckycookie.crewin.exception.memberSession;

import com.luckycookie.crewin.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public abstract class MemberSessionException extends ApplicationException {
    protected MemberSessionException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}