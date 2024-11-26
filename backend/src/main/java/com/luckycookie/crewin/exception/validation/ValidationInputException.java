package com.luckycookie.crewin.exception.validation;

import static com.luckycookie.crewin.exception.constants.ValidationExceptionList.INVALID_INPUT_EXCEPTION;

public class ValidationInputException extends ValidationException{
    public ValidationInputException() {
        super(INVALID_INPUT_EXCEPTION.getErrorCode(),
                INVALID_INPUT_EXCEPTION.getHttpStatus(),
                INVALID_INPUT_EXCEPTION.getMessage());
    }
}
