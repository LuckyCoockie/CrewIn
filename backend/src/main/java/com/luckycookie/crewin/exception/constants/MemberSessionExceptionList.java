package com.luckycookie.crewin.exception.constants;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum MemberSessionExceptionList {

    NOT_FOUND_MEMBER_SESSION_ERROR("MS0001", HttpStatus.NOT_FOUND, "해당 세션에 멤버가 일치하지 않습니다."),
    DUPLICATE_APPLY_EXCEPTION("MS0002", HttpStatus.CONFLICT, "이미 신청한 세션입니다.");

    private final String errorCode;
    private final HttpStatus httpStatus;
    private final String message;

}
