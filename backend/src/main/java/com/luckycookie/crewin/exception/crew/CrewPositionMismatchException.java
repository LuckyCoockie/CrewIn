package com.luckycookie.crewin.exception.crew;
import static com.luckycookie.crewin.exception.constants.CrewExceptionList.CREW_POSITION_MISMATCH_ERROR;

public class CrewPositionMismatchException extends CrewException{

    public CrewPositionMismatchException() {
        super(CREW_POSITION_MISMATCH_ERROR.getErrorCode(),
                CREW_POSITION_MISMATCH_ERROR.getHttpStatus(),
                CREW_POSITION_MISMATCH_ERROR.getMessage());
    }

}
