package com.luckycookie.crewin.domain;

import com.luckycookie.crewin.dto.MemberResponse;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat")
@ToString
public class Chat {
    @Id
    private Long id;
    private Long crewId;
    private Long senderId;
    private String content;
    private LocalDateTime createTime;

}