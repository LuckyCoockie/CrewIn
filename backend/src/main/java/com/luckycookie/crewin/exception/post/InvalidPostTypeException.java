package com.luckycookie.crewin.exception.post;

import static com.luckycookie.crewin.exception.constants.PostExceptionList.INVALID_POST_ERROR;

public class InvalidPostTypeException extends PostException {
    public InvalidPostTypeException() {
        super(INVALID_POST_ERROR.getErrorCode(),
                INVALID_POST_ERROR.getHttpStatus(),
                INVALID_POST_ERROR.getMessage());
    }
}
