package com.luckycookie.crewin.exception.course;

import static com.luckycookie.crewin.exception.constants.CourseExceptionList.NOT_MATCH_MEMBER_COURSE_ERROR;

public class NotMatchMemberCourseException extends CourseException {
    public NotMatchMemberCourseException() {
        super(NOT_MATCH_MEMBER_COURSE_ERROR.getErrorCode(),
                NOT_MATCH_MEMBER_COURSE_ERROR.getHttpStatus(),
                NOT_MATCH_MEMBER_COURSE_ERROR.getMessage());
    }
}
