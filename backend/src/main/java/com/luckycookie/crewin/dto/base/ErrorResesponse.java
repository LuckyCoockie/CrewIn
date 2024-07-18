package com.luckycookie.crewin.dto.base;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;

@Getter
@RequiredArgsConstructor
public class ErrorResesponse {
    private LocalDateTime timeStamp;
    private String errorCode;
    private String message;

    public ErrorResesponse(String errorCode, String message) {
        this.timeStamp = LocalDateTime.now().withNano(0);
        this.errorCode = errorCode;
        this.message = message;
    }
}