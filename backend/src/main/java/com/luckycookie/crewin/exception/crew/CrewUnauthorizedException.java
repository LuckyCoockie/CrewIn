package com.luckycookie.crewin.exception.crew;

import org.springframework.http.HttpStatus;

import static com.luckycookie.crewin.exception.constants.CrewExceptionList.CREW_UNAUTHORIZED_ERROR;

public class CrewUnauthorizedException extends CrewException{
    public CrewUnauthorizedException() {
        super(CREW_UNAUTHORIZED_ERROR.getErrorCode(),
                CREW_UNAUTHORIZED_ERROR.getHttpStatus(),
                CREW_UNAUTHORIZED_ERROR.getMessage());
    }
}
