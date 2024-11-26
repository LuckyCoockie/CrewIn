package com.luckycookie.crewin.exception.crew;

import static com.luckycookie.crewin.exception.constants.CrewExceptionList.CREW_DUPLICATE_ERROR;

public class CrewDupulicateException extends CrewException{
    public CrewDupulicateException() {
        super(CREW_DUPLICATE_ERROR.getErrorCode(),
                CREW_DUPLICATE_ERROR.getHttpStatus(),
                CREW_DUPLICATE_ERROR.getMessage());
    }
}
