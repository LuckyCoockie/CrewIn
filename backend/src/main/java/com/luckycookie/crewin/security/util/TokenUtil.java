package com.luckycookie.crewin.security.util;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.Token;
import com.luckycookie.crewin.domain.redis.Auth;
import com.luckycookie.crewin.repository.RefreshTokenRedisRepository;
import com.luckycookie.crewin.security.dto.CustomUser;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static com.luckycookie.crewin.exception.constants.SecurityExceptionList.*;

@Component
@Slf4j
@RequiredArgsConstructor
public class TokenUtil {

    @Value("${security.secret-key}")
    private String secretKey;
    private final Long accessTokenExpireTime = 60 * 60L; // 1시간
    private final Long refreshTokenExpireTime = 60 * 60 * 24 * 7L; // 일주일
    private SecretKey key;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;

    public void makeAuthentication(Member member) {
        // Authentication 만들기
        CustomUser customUser = CustomUser.builder().email(member.getEmail()).roles(Collections.singletonList(member.getRole().toString())).build();

        // ContextHolder에 Authentication 정보 저장
        Authentication auth = getAuthentication(customUser);
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    public Authentication getAuthentication(CustomUser user) {
        List<GrantedAuthority> grantedAuthorities = user.getRoles().stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());

        return new UsernamePasswordAuthenticationToken(user, "", grantedAuthorities);
    }

    public boolean validateToken(String token, HttpServletRequest request) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.info("잘못된 JWT 서명입니다.");
            request.setAttribute("exception", MALFORMED_TOKEN.getErrorCode());
        } catch (ExpiredJwtException e) {
            log.info("만료된 JWT 토큰입니다.");
            request.setAttribute("exception", EXPIRED_TOKEN.getErrorCode());
        } catch (UnsupportedJwtException e) {
            log.info("지원되지 않는 JWT 토큰입니다.");
            request.setAttribute("exception", UNSUPPORTED_TOKEN.getErrorCode());
        } catch (IllegalArgumentException e) {
            log.info("JWT 토큰이 잘못되었습니다.");
            request.setAttribute("exception", ILLEGAL_TOKEN.getErrorCode());
        } catch (Exception e) {
            log.info(e.getMessage());
            request.setAttribute("exception", ACCESS_DENIED.getErrorCode());
        }
        return false;
    }

    public Token generateToken(Member member) {
        String accessToken = Jwts.builder().subject(member.getEmail()).issuedAt(Timestamp.valueOf(LocalDateTime.now())).claim("email", member.getEmail()).expiration(Date.from(Instant.now().plus(accessTokenExpireTime, ChronoUnit.SECONDS))).signWith(key).compact();

        String refreshToken = Jwts.builder().subject(member.getEmail()).issuedAt(Timestamp.valueOf(LocalDateTime.now())).claim("id", member.getId()).expiration(Date.from(Instant.now().plus(refreshTokenExpireTime, ChronoUnit.SECONDS))).signWith(key).compact();

        // redis에 refresh Token 저장
        refreshTokenRedisRepository.save(Auth.builder().email(member.getEmail()).refreshToken(refreshToken).build());

        return Token.builder().memberId(member.getId()).accessToken(accessToken).refreshToken(refreshToken).build();
    }

    @PostConstruct
    public void generateKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String getSubject(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
    }

    public Object getClaim(String token, String claimName, Class<?> classType) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().get(claimName, classType);
    }
}
