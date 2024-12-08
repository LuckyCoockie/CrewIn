package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.ChatRequest;
import com.luckycookie.crewin.dto.ChatRequest.MessageRequest;
import com.luckycookie.crewin.dto.ChatRequest.ReadMessageRequest;
import com.luckycookie.crewin.dto.ChatResponse.ChatRoomResponse;
import com.luckycookie.crewin.dto.ChatResponse.MessageResponse;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/send/{crewId}")
    @SendTo("/topic/chat/{crewId}")
    public MessageResponse sendMessage(@DestinationVariable Long crewId, MessageRequest messageRequest) {
        log.info("message: {}", messageRequest.getMessage());
        return chatService.createChat(crewId, messageRequest);
    }

    @MessageMapping("/read/{crewId}")
    public void readMessage(@DestinationVariable Long crewId, ReadMessageRequest readMessageRequest) {
        log.info("read message: {}({})", readMessageRequest.getReaderId(), readMessageRequest.getMessageId());
        chatService.readMessage(crewId, readMessageRequest);
    }

    /* 나의 채팅방 목록 조회 */
    @GetMapping("/rooms")
    public ResponseEntity<BaseResponse<List<ChatRoomResponse>>> getChatRooms(@AuthenticationPrincipal CustomUser customUser) {
        // 크루 채팅방 목록 + 가장 최근 채팅 반환
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루 채팅방 목록을 조회했습니다.", chatService.getChatRooms(customUser.getEmail())));
    }

    /* 채팅방 메시지 페이징으로 조회 */
    @GetMapping("/rooms/{crewId}/messages")
    public ResponseEntity<BaseResponse<List<MessageResponse>>> getChatsByCrewId(@PathVariable("crewId") Long crewId, String lastId, int size) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "채팅 목록을 조회했습니다.", chatService.getChatsByCrewId(crewId, lastId, size)));
    }


}
