package com.luckycookie.crewin.exception.constants;


import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum PostExceptionList {
    NOT_FOUND_POST_ERROR("P0001", HttpStatus.NOT_FOUND, "게시물을 찾는데 실패했습니다."),
    INVALID_POST_ERROR("P0002", HttpStatus.BAD_REQUEST, "일치하는 게시글 타입이 없습니다."),
    IMAGE_REQUIRED_ERROR("P0003", HttpStatus.BAD_REQUEST, "이미지는 필수입니다."),
    UNAUTHORIZED_POST_ERROR("P0004", HttpStatus.BAD_REQUEST, "게시물에 대한 권한이 없습니다.");

    private final String errorCode;
    private final HttpStatus httpStatus;
    private final String message;
}
