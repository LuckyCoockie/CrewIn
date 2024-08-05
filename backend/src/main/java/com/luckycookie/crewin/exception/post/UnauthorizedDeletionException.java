package com.luckycookie.crewin.exception.post;

import static com.luckycookie.crewin.exception.constants.PostExceptionList.UNAUTHORIZED_POST_ERROR;

public class UnauthorizedDeletionException extends PostException {
    public UnauthorizedDeletionException() {
        super(UNAUTHORIZED_POST_ERROR.getErrorCode(), UNAUTHORIZED_POST_ERROR.getHttpStatus(), UNAUTHORIZED_POST_ERROR.getMessage());
    }
}
