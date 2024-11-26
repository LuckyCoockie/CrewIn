package com.luckycookie.crewin.exception.constants;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CommentExceptionList {
    NOT_FOUND_COMMENT_ERROR("CM0001", HttpStatus.NOT_FOUND, "댓글을 찾는데 실패했습니다."),
    NOT_MATCH_MEMBER_COMMENT_ERROR("CM0002",HttpStatus.NOT_FOUND, "댓글과 작성자가 일치하지 않습니다.");

    private final String errorCode;
    private final HttpStatus httpStatus;
    private final String message;
}
