package com.luckycookie.crewin.exception.constants;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AttendanceExceptionList {
    INVALID_REQUEST_TIME("A0001", HttpStatus.BAD_REQUEST, "출석 가능한 시간이 아닙니다."),
    INVALID_LOCATION("A0002", HttpStatus.BAD_REQUEST, "출석 가능한 위치가 아닙니다.");

    private final String errorCode;
    private final HttpStatus httpStatus;
    private final String message;
}
