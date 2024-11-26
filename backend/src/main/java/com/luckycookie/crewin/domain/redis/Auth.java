package com.luckycookie.crewin.domain.redis;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@RedisHash(value = "Auth", timeToLive = 604800) // 일주일
public class Auth {
    @Id
    private String email;
    private String refreshToken;
}
