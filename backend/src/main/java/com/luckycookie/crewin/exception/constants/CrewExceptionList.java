package com.luckycookie.crewin.exception.constants;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CrewExceptionList {
    NOT_FOUND_CREW_ERROR("C0001", HttpStatus.NOT_FOUND, "크루를 찾는데 실패했습니다.");

    private final String errorCode;
    private final HttpStatus httpStatus;
    private final String message;
}
