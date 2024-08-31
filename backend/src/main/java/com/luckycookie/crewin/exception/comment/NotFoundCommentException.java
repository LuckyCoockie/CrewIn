package com.luckycookie.crewin.exception.comment;

import static com.luckycookie.crewin.exception.constants.CommentExceptionList.NOT_FOUND_COMMENT_ERROR;

public class NotFoundCommentException extends CommentException{
    public NotFoundCommentException() {
        super(
                NOT_FOUND_COMMENT_ERROR.getErrorCode(),
                NOT_FOUND_COMMENT_ERROR.getHttpStatus(),
                NOT_FOUND_COMMENT_ERROR.getMessage()
        );
    }
}
