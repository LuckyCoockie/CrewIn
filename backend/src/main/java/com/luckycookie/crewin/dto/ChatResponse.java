package com.luckycookie.crewin.dto;

import com.luckycookie.crewin.dto.MemberResponse.MemberItem;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Builder
@AllArgsConstructor
public class ChatResponse {
    private Long crewId;         // 채팅방 ID
    private MemberItem sender;   // 보낸 사람
    private String message;      // 메시지 내용
    @Builder.Default
    private List<String> images = new ArrayList<>(); // 이미지들
    private LocalDateTime createTime; // 전송 시간
}
