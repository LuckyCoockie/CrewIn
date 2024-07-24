package com.luckycookie.crewin.exception.constants;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum SessionExceptionList {
    NOT_FOUND_SESSION_ERROR("S0001", HttpStatus.NOT_FOUND, "세션을 찾는데 실패했습니다."),
    NOT_FOUND_SESSION_TYPE_ERROR("S0002", HttpStatus.NOT_FOUND, "해당하는 세션 타입을 찾는데 실패했습니다."),
    UPDATE_AUTHORIZATION_ERROR("S0003", HttpStatus.UNAUTHORIZED, "세션 수정에 대한 권한이 존재하지 않습니다.");

    private final String errorCode;
    private final HttpStatus httpStatus;
    private final String message;
}
