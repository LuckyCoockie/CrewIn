package com.luckycookie.crewin.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
public class ChatController {

    @MessageMapping("/send/{crewId}")
    @SendTo("/topic/chat/{crewId}")
    public
}
