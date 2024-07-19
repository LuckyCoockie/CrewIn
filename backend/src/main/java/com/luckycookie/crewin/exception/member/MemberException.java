package com.luckycookie.crewin.exception.member;

import com.luckycookie.crewin.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class MemberException extends ApplicationException {
    protected MemberException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
