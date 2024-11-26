package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.redis.EmailCertification;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailRedisRepository extends CrudRepository<EmailCertification, String> {
}
