package com.luckycookie.crewin.exception.crew;

import static com.luckycookie.crewin.exception.constants.CrewExceptionList.CREW_MEMBER_NOT_EXIST_ERROR;

public class CrewMemberNotExsistException extends CrewException{

    public CrewMemberNotExsistException() {
        super(CREW_MEMBER_NOT_EXIST_ERROR.getErrorCode(),
                CREW_MEMBER_NOT_EXIST_ERROR.getHttpStatus(),
                CREW_MEMBER_NOT_EXIST_ERROR.getMessage());
    }
}
