package com.luckycookie.crewin.exception.crew;

import static com.luckycookie.crewin.exception.constants.CrewExceptionList.CREW_MEMBER_DELETE_ERROR;

public class CrewMemberDeleteException extends CrewException {

    public CrewMemberDeleteException() {
        super(CREW_MEMBER_DELETE_ERROR.getErrorCode(),
                CREW_MEMBER_DELETE_ERROR.getHttpStatus(),
                CREW_MEMBER_DELETE_ERROR.getMessage());
    }

}
