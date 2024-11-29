package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChatRepository extends MongoRepository<Chat, Long> {
}
