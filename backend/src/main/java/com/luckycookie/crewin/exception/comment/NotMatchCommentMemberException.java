package com.luckycookie.crewin.exception.comment;

import static com.luckycookie.crewin.exception.constants.CommentExceptionList.NOT_MATCH_MEMBER_COMMENT_ERROR;

public class NotMatchCommentMemberException extends CommentException {
    public NotMatchCommentMemberException() {
        super(
                NOT_MATCH_MEMBER_COMMENT_ERROR.getErrorCode(),
                NOT_MATCH_MEMBER_COMMENT_ERROR.getHttpStatus(),
                NOT_MATCH_MEMBER_COMMENT_ERROR.getMessage()
        );
    }
}
