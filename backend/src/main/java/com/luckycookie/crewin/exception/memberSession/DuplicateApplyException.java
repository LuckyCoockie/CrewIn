package com.luckycookie.crewin.exception.memberSession;

import static com.luckycookie.crewin.exception.constants.MemberSessionExceptionList.DUPLICATE_APPLY_ERROR;

public class DuplicateApplyException extends MemberSessionException {
    public DuplicateApplyException() {
        super(DUPLICATE_APPLY_ERROR.getErrorCode(), DUPLICATE_APPLY_ERROR.getHttpStatus(), DUPLICATE_APPLY_ERROR.getMessage());
    }
}
