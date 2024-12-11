package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.ReadStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReadStatusRepository extends MongoRepository<ReadStatus, String> {

    Optional<ReadStatus> findByCrewIdAndReaderId(Long crewId, Long readerId);
}
