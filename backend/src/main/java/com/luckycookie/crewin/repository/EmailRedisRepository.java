package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.redis.EmailCertification;
import org.springframework.data.repository.CrudRepository;

public interface EmailRedisRepository extends CrudRepository<EmailCertification, String> {
}
