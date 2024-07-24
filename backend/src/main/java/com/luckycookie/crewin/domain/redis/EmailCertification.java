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
@RedisHash(value = "EmailCertification", timeToLive = 300) // value: redis의 keyspace값
//keyspace와 합쳐져서 레디스에 저장된 최종 키 값은 keyspace:id가 된다.
public class EmailCertification {
    @Id
    private String email;   // redis key값
    private String certificationNumber;
}
