package com.luckycookie.crewin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.luckycookie.crewin.dto.MemberResponse.MemberItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


public class ChatResponse {

    @Builder
    @AllArgsConstructor
    @Getter
    @NoArgsConstructor
    public static class MessageResponse {
        private String messageId;    // 메세지 ID
        private Long crewId;         // 채팅방 ID
        private MemberItem sender;   // 보낸 사람
        private String message;      // 메시지 내용
        @Builder.Default
        private List<String> images = new ArrayList<>(); // 이미지들
        @JsonSerialize(using = LocalDateTimeSerializer.class)
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createTime; // 전송 시간
    }

    @Builder
    @AllArgsConstructor
    @Getter
    @NoArgsConstructor
    public static class MessagePagingResponse {
        List<MessageResponse> messages = new ArrayList<>();
    }

    @Builder
    @AllArgsConstructor
    @Getter
    @NoArgsConstructor
    public static class ChatRoomResponse {
        private Long crewId;                // 크루 ID
        private String crewName;            // 크루명
        private String mainLogo;            // 크루 메인 로고
        private String lastMessageId;       // 마지막 메세지 ID
        private String lastMessage;         // 마지막 메세지
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        @JsonSerialize(using = LocalDateTimeSerializer.class)
        private LocalDateTime createTime;   // 메세지 전송 시간
        private int unreadCount;            // 미확인 메세지 개수
    }
}
