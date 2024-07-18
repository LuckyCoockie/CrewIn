package com.luckycookie.crewin.exception.crew;

import static com.luckycookie.crewin.exception.constants.CrewExceptionList.NOT_FOUND_CREW_ERROR;

public class NotFoundCrewException extends CrewException {
    public NotFoundCrewException() {
        super(NOT_FOUND_CREW_ERROR.getErrorCode(),
                NOT_FOUND_CREW_ERROR.getHttpStatus(),
                NOT_FOUND_CREW_ERROR.getMessage());
    }
}
