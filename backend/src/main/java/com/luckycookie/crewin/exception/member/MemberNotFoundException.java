package com.luckycookie.crewin.exception.member;

import static com.luckycookie.crewin.exception.constants.MemberExceptionList.NOT_FOUND_MEMBER;

public class MemberNotFoundException extends MemberException {
    public MemberNotFoundException() {
        super(
                NOT_FOUND_MEMBER.getErrorCode(),
                NOT_FOUND_MEMBER.getHttpStatus(),
                NOT_FOUND_MEMBER.getMessage()
        );
    }
}
