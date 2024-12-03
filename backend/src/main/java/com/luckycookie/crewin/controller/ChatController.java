package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.ChatRequest;
import com.luckycookie.crewin.dto.ChatResponse;
import com.luckycookie.crewin.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/send/{crewId}")
    @SendTo("/topic/chat/{crewId}")
    public ChatResponse sendMessage(@DestinationVariable Long crewId, ChatRequest chatRequest) {
        log.info("message: {}", chatRequest.getMessage());
        return chatService.createChat(crewId, chatRequest);
    }
}
