package com.luckycookie.crewin.exception.validation;

import static com.luckycookie.crewin.exception.constants.ValidationExceptionList.INVALID_CONTENT_INPUT_EXCEPTION;

public class ValidationContentException extends ValidationException{
    public ValidationContentException() {
        super(INVALID_CONTENT_INPUT_EXCEPTION.getErrorCode(),
                INVALID_CONTENT_INPUT_EXCEPTION.getHttpStatus(),
                INVALID_CONTENT_INPUT_EXCEPTION.getMessage());
    }
}
