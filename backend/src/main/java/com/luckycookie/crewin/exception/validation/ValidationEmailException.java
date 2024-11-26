package com.luckycookie.crewin.exception.validation;

import static com.luckycookie.crewin.exception.constants.ValidationExceptionList.INVALID_EMAIL_EXCEPTION;

public class ValidationEmailException extends ValidationException{
    public ValidationEmailException() {
        super(INVALID_EMAIL_EXCEPTION.getErrorCode(),
                INVALID_EMAIL_EXCEPTION.getHttpStatus(),
                INVALID_EMAIL_EXCEPTION.getMessage());
    }
}
