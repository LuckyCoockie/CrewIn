package com.luckycookie.crewin.exception.memberSession;

import com.luckycookie.crewin.exception.constants.MemberSessionExceptionList;

import static com.luckycookie.crewin.exception.constants.MemberSessionExceptionList.DUPLICATE_APPLY_EXCEPTION;

public class DuplicateApplyException extends MemberSessionException {
    public DuplicateApplyException() {
        super(DUPLICATE_APPLY_EXCEPTION.getErrorCode(), DUPLICATE_APPLY_EXCEPTION.getHttpStatus(), DUPLICATE_APPLY_EXCEPTION.getMessage());
    }
}
