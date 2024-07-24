package com.luckycookie.crewin.exception.memberCrew;

import com.luckycookie.crewin.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public abstract class MemberCrewException extends ApplicationException {
    protected MemberCrewException(String errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }
}
