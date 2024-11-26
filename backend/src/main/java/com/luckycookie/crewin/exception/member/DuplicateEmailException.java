package com.luckycookie.crewin.exception.member;


import static com.luckycookie.crewin.exception.constants.MemberExceptionList.DUPLICATE_MEMBER_EMAIL;

public class DuplicateEmailException extends MemberException {
    public DuplicateEmailException() {
        super(DUPLICATE_MEMBER_EMAIL.getErrorCode(), DUPLICATE_MEMBER_EMAIL.getHttpStatus(), DUPLICATE_MEMBER_EMAIL.getMessage());
    }
}
