package com.luckycookie.crewin.exception.constants;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum NotificationExceptionList {
    NOT_FOUND_NOTIFICATION_ERROR("N0001", HttpStatus.NOT_FOUND, "존재하지 않는 알림입니다."),
    NOT_MATCH_MEMBER_NOTIFICATION_ERROR("N0002", HttpStatus.NOT_FOUND, "멤버와 알림간 관계가 없습니다.");
    private final String errorCode;
    private final HttpStatus httpStatus;
    private final String message;
}
