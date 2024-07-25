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
    DUPLICATE_MEMBER_NICKNAME("M0004", HttpStatus.CONFLICT, "이미 사용중인 닉네임입니다."),
    EMAIL_SEND_ERROR("M0005", HttpStatus.NOT_FOUND, "이메일 발송에 실패했습니다."),
    EMAIL_NOT_FOUND("M0006", HttpStatus.NOT_FOUND, "이메일을 찾을 수 없습니다."),
    ALREADY_LOGOUT_ERROR("M0007", HttpStatus.BAD_REQUEST, "이미 로그아웃한 회원입니다.");

    private final String errorCode;
    private final HttpStatus httpStatus;
    private final String message;
}
