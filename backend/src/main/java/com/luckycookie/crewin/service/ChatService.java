package com.luckycookie.crewin.service;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.luckycookie.crewin.domain.*;
import com.luckycookie.crewin.dto.ChatRequest;
import com.luckycookie.crewin.dto.ChatRequest.MessageRequest;
import com.luckycookie.crewin.dto.ChatRequest.ReadMessageRequest;
import com.luckycookie.crewin.dto.ChatResponse;
import com.luckycookie.crewin.dto.ChatResponse.ChatRoomResponse;
import com.luckycookie.crewin.dto.ChatResponse.MessageResponse;
import com.luckycookie.crewin.dto.MemberResponse;
import com.luckycookie.crewin.dto.MemberResponse.MemberItem;
import com.luckycookie.crewin.exception.member.MemberNotFoundException;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.repository.*;
import jakarta.persistence.Id;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatRepository chatRepository;
    private final MongoTemplate mongoTemplate;
    private final MemberRepository memberRepository;
    private final MemberCrewRepository membercrewRepository;
    private final ReadStatusRepository readStatusRepository;

    @Transactional
    public MessageResponse createChat(Long crewId, MessageRequest messageRequest) {
        Chat chat = Chat.builder()
                .crewId(crewId)
                .senderId(messageRequest.getSenderId())
                .message(messageRequest.getMessage())
                .images(messageRequest.getImages())
                .createTime(LocalDateTime.now())
                .build();
        chatRepository.save(chat);

        Member sender = memberRepository.findById(messageRequest.getSenderId()).orElseThrow(MemberNotFoundException::new);
        MemberItem memberItem = MemberItem.builder()
                .memberId(sender.getId())
                .memberNickName(sender.getNickname())
                .memberName(sender.getName())
                .profileUrl(sender.getImageUrl())
                .build();

        return MessageResponse.builder()
                .messageId(chat.getId())
                .crewId(chat.getCrewId())
                .sender(memberItem)
                .message(chat.getMessage())
                .images(chat.getImages())
                .createTime(chat.getCreateTime())
                .build();
    }

    // 커서 기반 페이지네이션
    public List<MessageResponse> getChatsByCrewId(Long crewId, String lastId, int size) {

        // lastId가 null이면 첫 번째 페이지로, 아니면 ObjectId로 변환
        ObjectId lastObjectId = (lastId != null) ? new ObjectId(lastId) : null;

        // Query 객체 생성
        Query query = new Query();
        query.addCriteria(Criteria.where("crewId").is(crewId));

        // 기준 id가 있다면 그보다 작은 id만 조회
        if (lastObjectId != null) {
            query.addCriteria(Criteria.where("id").lt(lastObjectId));
        }

        // 내림차순 정렬 (id 기준)
        query.with(Sort.by(Sort.Order.desc("id")));

        // 크기 제한
        query.limit(size);

        // MongoTemplate을 사용하여 쿼리 실행
        return mongoTemplate.find(query, Chat.class).stream().map(
                c -> {
                    Member member = memberRepository.findById(c.getSenderId()).orElse(null);
                    MemberItem sender = null;
                    if (member != null) {
                        sender = MemberItem.builder()
                                .memberId(member.getId())
                                .memberNickName(member.getNickname())
                                .memberName(member.getName())
                                .profileUrl(member.getImageUrl())
                                .build();
                    }
                    return MessageResponse.builder().crewId(c.getCrewId())
                            .sender(sender)
                            .message(c.getMessage())
                            .images(c.getImages())
                            .createTime(c.getCreateTime())
                            .build();
                }
        ).toList();
    }

    public List<ChatRoomResponse> getChatRooms(String email) {
        Member member = memberRepository.findFirstByEmail(email).orElseThrow(NotFoundMemberException::new);
        List<MemberCrew> memberCrews = membercrewRepository.findCrewByMemberAndIsJoined(member);

        return memberCrews.stream().map(mc -> {
            Crew crew = mc.getCrew();
            Chat chat = chatRepository.findFirstByCrewIdOrderByIdDesc(crew.getId()).orElse(Chat.builder().message(null).createTime(null).build());
            ReadStatus readStatus = readStatusRepository.findByCrewIdAndReaderId(crew.getId(), member.getId()).orElse(null);
            int unreadCount = readStatus != null ? chatRepository.countByCrewIdAndIdGreaterThan(crew.getId(), readStatus.getLastMessageId()) : chatRepository.countByCrewId(crew.getId());

            return ChatRoomResponse.builder()
                    .crewId(crew.getId())
                    .crewName(crew.getCrewName())
                    .mainLogo(crew.getMainLogo())
                    .lastMessageId(chat.getId())
                    .lastMessage(chat.getMessage())
                    .createTime(chat.getCreateTime())
                    .unreadCount(unreadCount)
                    .build();
        }).toList();
    }

    @Transactional
    public void readMessage(Long crewId, ReadMessageRequest readMessageRequest) {
        ReadStatus readStatus = readStatusRepository.findByCrewIdAndReaderId(crewId, readMessageRequest.getReaderId()).orElseGet(() -> {
            ReadStatus newReadStatus = ReadStatus.builder().crewId(crewId)
                    .readerId(readMessageRequest.getReaderId()).lastMessageId(readMessageRequest.getMessageId()).build();
            return readStatusRepository.save(newReadStatus);
        });

        if (!readStatus.getLastMessageId().equals(readMessageRequest.getMessageId())) {
            readStatus.setLastMessageId(readMessageRequest.getMessageId());
            readStatusRepository.save(readStatus); // 변경 사항 명시적으로 저장
        }
    }
}
