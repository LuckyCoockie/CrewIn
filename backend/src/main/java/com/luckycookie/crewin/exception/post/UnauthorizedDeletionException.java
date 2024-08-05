package com.luckycookie.crewin.exception.post;

import com.luckycookie.crewin.exception.constants.PostExceptionList;

import static com.luckycookie.crewin.exception.constants.PostExceptionList.UNAUTHORIZED_DELETION_ERROR;

public class UnauthorizedDeletionException extends PostException {
    public UnauthorizedDeletionException() {
        super(UNAUTHORIZED_DELETION_ERROR.getErrorCode(), UNAUTHORIZED_DELETION_ERROR.getHttpStatus(), UNAUTHORIZED_DELETION_ERROR.getMessage());
    }
}
