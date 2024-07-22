package com.luckycookie.crewin.exception.constants;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum MemberExceptionList {
    NOT_FOUND_MEMBER("M0001", HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."),
    LOGIN_FAIL("M0002", HttpStatus.UNAUTHORIZED, "로그인에 실패했습니다."),
    DUPLICATE_MEMBER_EMAIL("M0003", HttpStatus.CONFLICT, "이미 가입된 이메일입니다."),
    DUPLICATE_MEMBER_NICKNAME("M0004", HttpStatus.CONFLICT, "이미 사용중인 닉네임입니다.");

    private final String errorCode;
    private final HttpStatus httpStatus;
    private final String message;
}
