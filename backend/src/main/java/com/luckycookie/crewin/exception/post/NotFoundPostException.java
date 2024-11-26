package com.luckycookie.crewin.exception.post;

import lombok.Getter;

import static com.luckycookie.crewin.exception.constants.PostExceptionList.NOT_FOUND_POST_ERROR;

@Getter
public class NotFoundPostException extends PostException {

    public NotFoundPostException() {
        super(NOT_FOUND_POST_ERROR.getErrorCode(),
                NOT_FOUND_POST_ERROR.getHttpStatus(),
                NOT_FOUND_POST_ERROR.getMessage());
    }
}
