package com.luckycookie.crewin.domain;

import com.querydsl.core.annotations.QueryEntity;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat")
@ToString
public class Chat {
    @Id
    private String id;
    private Long crewId;
    private Long senderId;
    private String message;
    private LocalDateTime createTime;
    @Builder.Default
    private List<String> images = new ArrayList<>();
}