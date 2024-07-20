package com.luckycookie.crewin.exception.constants;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CourseExceptionList {
    NOT_FOUND_COURSE_ERROR("C0001",HttpStatus.NOT_FOUND, "코스를 찾는데 실패했습니다.");

    private final String errorCode;
    private final HttpStatus httpStatus;
    private final String message;
}
