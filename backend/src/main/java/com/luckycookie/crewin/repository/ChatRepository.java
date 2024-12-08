package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Chat;
import com.luckycookie.crewin.domain.QSession;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String> {
    Optional<Chat> findFirstByCrewIdOrderByIdDesc(Long crewId);
}
