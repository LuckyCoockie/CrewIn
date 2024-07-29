package com.luckycookie.crewin.exception.crew;


import static com.luckycookie.crewin.exception.constants.CrewExceptionList.CREW_MEMBER_INVITED_ERROR;

public class CrewMemberInvitedException extends CrewException {
    public CrewMemberInvitedException() {
        super(CREW_MEMBER_INVITED_ERROR.getErrorCode(),
                CREW_MEMBER_INVITED_ERROR.getHttpStatus(),
                CREW_MEMBER_INVITED_ERROR.getMessage());
    }
}
