package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.redis.Auth;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRedisRepository extends CrudRepository<Auth, String> {
}
