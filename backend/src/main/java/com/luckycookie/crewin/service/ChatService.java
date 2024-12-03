package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Chat;
import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.dto.ChatRequest;
import com.luckycookie.crewin.dto.ChatResponse;
import com.luckycookie.crewin.dto.MemberResponse;
import com.luckycookie.crewin.exception.member.MemberNotFoundException;
import com.luckycookie.crewin.repository.ChatRepository;
import com.luckycookie.crewin.repository.MemberRepository;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatRepository chatRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public ChatResponse createChat(Long crewId, ChatRequest chatRequest) {
        Chat chat = Chat.builder()
                .crewId(crewId)
                .senderId(chatRequest.getSenderId())
                .message(chatRequest.getMessage())
                .images(chatRequest.getImages())
                .createTime(LocalDateTime.now())
                .build();
        chatRepository.save(chat);

        Member sender = memberRepository.findById(chatRequest.getSenderId()).orElseThrow(MemberNotFoundException::new);
        MemberResponse.MemberItem memberItem = MemberResponse.MemberItem.builder()
                .memberId(sender.getId())
                .memberNickName(sender.getNickname())
                .memberName(sender.getName())
                .profileUrl(sender.getImageUrl())
                .build();

        return ChatResponse.builder()
                .crewId(chat.getCrewId())
                .sender(memberItem)
                .message(chat.getMessage())
                .images(chat.getImages())
                .createTime(chat.getCreateTime())
                .build();
    }
}
