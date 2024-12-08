package com.luckycookie.crewin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

public class ChatRequest{

    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    public static class MessageRequest {
        private Long senderId;       // 보낸 사람
        private String message;      // 메시지 내용
        @Builder.Default
        private List<String> images = new ArrayList<>(); // 이미지들
    }
}
