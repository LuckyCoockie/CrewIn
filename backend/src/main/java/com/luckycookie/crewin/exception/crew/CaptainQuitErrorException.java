package com.luckycookie.crewin.exception.crew;

import org.springframework.http.HttpStatus;

import static com.luckycookie.crewin.exception.constants.CrewExceptionList.CAPTAIN_QUIT_ERROR;

public class CaptainQuitErrorException extends CrewException{

    public CaptainQuitErrorException() {
        super(CAPTAIN_QUIT_ERROR.getErrorCode(), CAPTAIN_QUIT_ERROR.getHttpStatus(), CAPTAIN_QUIT_ERROR.getMessage());
    }
}
