package com.luckycookie.crewin.exception.constants;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum MemberExceptionList {
    NOT_FOUND_MEMBER("M0001", HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."),
    LOGIN_FAIL("M0002", HttpStatus.UNAUTHORIZED, "로그인에 실패했습니다.");

    private final String errorCode;
    private final HttpStatus httpStatus;
    private final String message;

}
