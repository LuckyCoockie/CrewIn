package com.luckycookie.crewin.exception.constants;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum HeartExceptionList {
    NOT_FOUND_HEART_ERROR("H0001", HttpStatus.NOT_FOUND, "좋아요를 찾는데 실패했습니다."),
    ALREADY_EXIST_HEART_ERROR("H0001", HttpStatus.NOT_FOUND, "이미 좋아요가 존재합니다.")
    ;

    private final String errorCode;
    private final HttpStatus httpStatus;
    private final String message;

}
