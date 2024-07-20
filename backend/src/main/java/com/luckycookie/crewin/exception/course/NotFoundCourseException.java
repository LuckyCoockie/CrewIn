package com.luckycookie.crewin.exception.course;

import static com.luckycookie.crewin.exception.constants.CourseExceptionList.NOT_FOUND_COURSE_ERROR;

public class NotFoundCourseException extends CourseException{
    public NotFoundCourseException() {
        super(NOT_FOUND_COURSE_ERROR.getErrorCode(),
                NOT_FOUND_COURSE_ERROR.getHttpStatus(),
                NOT_FOUND_COURSE_ERROR.getMessage());
    }
}
