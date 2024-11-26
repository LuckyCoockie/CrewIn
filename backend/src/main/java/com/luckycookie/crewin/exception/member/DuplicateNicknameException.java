package com.luckycookie.crewin.exception.member;

import static com.luckycookie.crewin.exception.constants.MemberExceptionList.DUPLICATE_MEMBER_NICKNAME;

public class DuplicateNicknameException extends MemberException {
    public DuplicateNicknameException() {
        super(DUPLICATE_MEMBER_NICKNAME.getErrorCode(), DUPLICATE_MEMBER_NICKNAME.getHttpStatus(), DUPLICATE_MEMBER_NICKNAME.getMessage());
    }
}
