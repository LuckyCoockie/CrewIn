package com.luckycookie.crewin.exception.memberCrew;

import static com.luckycookie.crewin.exception.constants.MemberCrewExceptionList.NOT_FOUND_MEMBER_CREW_ERROR;

public class NotFoundMemberCrewException extends MemberCrewException{
    public NotFoundMemberCrewException() {
        super(NOT_FOUND_MEMBER_CREW_ERROR.getErrorCode(),
                NOT_FOUND_MEMBER_CREW_ERROR.getHttpStatus(),
                NOT_FOUND_MEMBER_CREW_ERROR.getMessage());
    }
}
