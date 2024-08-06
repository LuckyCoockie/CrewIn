package com.luckycookie.crewin.exception.post;

import static com.luckycookie.crewin.exception.constants.PostExceptionList.INVALID_POST_ERROR;

public class InvalidPostException extends PostException {
    public InvalidPostException() {
        super(INVALID_POST_ERROR.getErrorCode(),
                INVALID_POST_ERROR.getHttpStatus(),
                INVALID_POST_ERROR.getMessage());
    }
}
