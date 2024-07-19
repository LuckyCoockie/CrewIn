package com.luckycookie.crewin.security.util;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.Token;
import com.luckycookie.crewin.dto.TokenResponse;
import com.luckycookie.crewin.security.dto.CustomUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TokenUtil {

    @Value("${security.secret-key}")
    private String secretKey;
    private final Long accessTokenExpireTime = 60 * 60L; // 1시간
    private final Long refreshTokenExpireTime = 60 * 60 * 24 * 7L; // 일주일
    private Key key;

    public void makeAuthentication(Member member) {
        // Authentication 만들기
        CustomUser customUser = CustomUser.builder()
                .email(member.getEmail())
                .roles(Collections.singletonList(member.getRole().toString()))
                .build();

        // ContextHolder에 Authentication 정보 저장
        Authentication auth = getAuthentication(customUser);
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    public Authentication getAuthentication(CustomUser user) {

        List<GrantedAuthority> grantedAuthorities = user.getRoles().stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        return new UsernamePasswordAuthenticationToken(user.getEmail(), "",
                grantedAuthorities);
    }

    public Token generateToken(Member member) {
        String accessToken = Jwts.builder()
                .subject(member.getEmail())
                .issuedAt(Timestamp.valueOf(LocalDateTime.now()))
                .claim("email", member.getEmail())
                .expiration(Date.from(Instant.now().plus(accessTokenExpireTime, ChronoUnit.SECONDS)))
                .signWith(key)
                .compact();

        String refreshToken = Jwts.builder()
                .subject(member.getEmail())
                .issuedAt(Timestamp.valueOf(LocalDateTime.now()))
                .expiration(Date.from(Instant.now().plus(refreshTokenExpireTime, ChronoUnit.SECONDS)))
                .signWith(key)
                .compact();

        return Token.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @PostConstruct
    public void generateKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }
}
