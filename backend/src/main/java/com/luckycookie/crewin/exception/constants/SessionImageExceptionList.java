package com.luckycookie.crewin.exception.constants;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum SessionImageExceptionList {

    SESSION_IMAGE_UPLOAD_ERROR("SI0001",HttpStatus.NOT_FOUND, "사진이 없습니다.");

    private final String errorCode;
    private final HttpStatus httpStatus;
    private final String message;

}
