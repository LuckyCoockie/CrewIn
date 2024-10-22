package com.luckycookie.crewin.exception.constants;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ValidationExceptionList {
    INVALID_INPUT_EXCEPTION("V0001",HttpStatus.BAD_REQUEST, "입력 형식이 잘못되었습니다."),
    INVALID_EMAIL_EXCEPTION("V0002",HttpStatus.BAD_REQUEST, "이메일 형식으로 입력되지 않았습니다."),
    INVALID_CONTENT_INPUT_EXCEPTION("V0003",HttpStatus.BAD_REQUEST, "입력에 허용되지 않은 특수문자가 포함되어 있습니다.");
    private final String errorCode;
    private final HttpStatus httpStatus;
    private final String message;


}
