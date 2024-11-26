package com.luckycookie.crewin.exception.memberSession;

import static com.luckycookie.crewin.exception.constants.MemberSessionExceptionList.NOT_FOUND_MEMBER_SESSION_ERROR;

public class NotFoundMemberSessionException extends MemberSessionException {

    public NotFoundMemberSessionException() {
        super(NOT_FOUND_MEMBER_SESSION_ERROR.getErrorCode(),
                NOT_FOUND_MEMBER_SESSION_ERROR.getHttpStatus(),
                NOT_FOUND_MEMBER_SESSION_ERROR.getMessage());
    }

}
