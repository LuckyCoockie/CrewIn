package com.luckycookie.crewin.exception.member;

import static com.luckycookie.crewin.exception.constants.MemberExceptionList.NOT_FOUND_MEMBER_ERROR;

public class NotFoundMemberException extends MemberException{
    public NotFoundMemberException() {
        super(NOT_FOUND_MEMBER_ERROR.getErrorCode(),
                NOT_FOUND_MEMBER_ERROR.getHttpStatus(),
                NOT_FOUND_MEMBER_ERROR.getMessage());
    }
}
