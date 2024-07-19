package com.luckycookie.crewin.exception.crew;

import static com.luckycookie.crewin.exception.constants.CrewExceptionList.CREW_LIST_ERROR;

public class CrewListException extends CrewException {

    public CrewListException() {
        super(CREW_LIST_ERROR.getErrorCode(),
                CREW_LIST_ERROR.getHttpStatus(),
                CREW_LIST_ERROR.getMessage());
    }

}
