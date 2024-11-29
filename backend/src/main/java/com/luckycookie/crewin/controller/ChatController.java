package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.ChatRequest;
import com.luckycookie.crewin.dto.ChatResponse;
import com.luckycookie.crewin.dto.CrewResponse.MyCrewItemResponse;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.ChatService;
import com.luckycookie.crewin.service.CrewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {

    private final CrewService crewService;
    private final ChatService chatService;

    @GetMapping("/chat")
    @ResponseBody
    public MyCrewItemResponse getMyCrew(@AuthenticationPrincipal CustomUser customUser) {
        return crewService.getMyCrewList(customUser);
    }

    @MessageMapping("/send/{crewId}")
    @SendTo("/topic/chat/{crewId}")
    public ChatResponse sendMessage(ChatRequest chatRequest) {
        return chatService.createChat(chatRequest);
    }
}
