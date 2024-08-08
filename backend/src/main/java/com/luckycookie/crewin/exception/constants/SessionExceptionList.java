package com.luckycookie.crewin.exception.constants;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum SessionExceptionList {
    NOT_FOUND_SESSION_ERROR("S0001", HttpStatus.NOT_FOUND, "세션을 찾는데 실패했습니다."),
    NOT_FOUND_SESSION_TYPE_ERROR("S0002", HttpStatus.NOT_FOUND, "해당하는 세션 타입을 찾는데 실패했습니다."),
    SESSION_AUTHORIZATION_ERROR("S0003", HttpStatus.UNAUTHORIZED, "세션에 대한 권한이 존재하지 않습니다."),
    SESSION_IN_PROGRESS("S0004", HttpStatus.BAD_REQUEST, "이미 진행된 세션은 삭제할 수 없습니다."),
    INVALID_SESSION("S0005", HttpStatus.BAD_REQUEST, "유효하지 않은 세션 요청입니다."),
    SESSION_MAX_MEMBER_ERROR("S0006", HttpStatus.BAD_REQUEST, "세션의 최대 인원이 초과되었습니다.");

    private final String errorCode;
    private final HttpStatus httpStatus;
    private final String message;
}
