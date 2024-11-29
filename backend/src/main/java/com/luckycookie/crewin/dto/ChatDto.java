package com.luckycookie.crewin.dto;

import com.luckycookie.crewin.domain.enums.MessageType;
import com.luckycookie.crewin.dto.MemberResponse.MemberItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ChatDto {
    private MessageType type;    // 메시지 타입
    private Long crewId;         // 채팅방 ID
    private MemberItem sender;       // 보낸 사람
    private String message;      // 메시지 내용
    private LocalDateTime timestamp; // 전송 시간
}
