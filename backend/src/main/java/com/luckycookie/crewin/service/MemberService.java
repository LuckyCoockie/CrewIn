package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.Token;
import com.luckycookie.crewin.domain.redis.Auth;
import com.luckycookie.crewin.dto.MemberRequest.SignInRequest;
import com.luckycookie.crewin.dto.MemberRequest.SignUpRequest;
import com.luckycookie.crewin.dto.MemberResponse.MemberProfileResponse;
import com.luckycookie.crewin.exception.member.*;
import com.luckycookie.crewin.exception.security.InvalidTokenException;
import com.luckycookie.crewin.repository.MemberRepository;
import com.luckycookie.crewin.repository.RefreshTokenRedisRepository;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.security.util.TokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;
    private final TokenUtil tokenUtil;
    private final MailService mailService;

    public Token signIn(SignInRequest signInRequest) {
        Member member = memberRepository.findByEmail(signInRequest.getEmail()).orElseThrow(MemberNotFoundException::new);
        if (passwordEncoder.matches(signInRequest.getPassword(), member.getPassword())) {
            return tokenUtil.generateToken(member);
        } else {
            throw new LoginFailException();
        }
    }

    public void signUp(SignUpRequest signUpRequest) {
        if (memberRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new DuplicateEmailException();
        }
        if (memberRepository.existsByNickname(signUpRequest.getNickname())) {
            throw new DuplicateNicknameException();
        }

        String encodedPassword = passwordEncoder.encode(signUpRequest.getPassword());

        Member member = Member.builder()
                .name(signUpRequest.getName())
                .nickname(signUpRequest.getNickname())
                .email(signUpRequest.getEmail())
                .password(encodedPassword)
                .build();

        memberRepository.save(member);
    }

    @Transactional(readOnly = true)
    public boolean checkDuplicateEmail(String email) {
        return memberRepository.existsByEmail(email);
    }

    @Transactional(readOnly = true)
    public boolean checkDuplicateNickname(String nickname) {
        return memberRepository.existsByNickname(nickname);
    }

    public Token reissue(String refreshToken, HttpServletRequest request) {
        if (tokenUtil.validateToken(refreshToken, request)) {
            String email = tokenUtil.getSubject(refreshToken);
            Auth auth = refreshTokenRedisRepository.findById(email).orElseThrow(InvalidTokenException::new);
            log.info("input refreshToken: {}", refreshToken);
            log.info("redis refreshToken: {}", auth.getRefreshToken());
            if (auth.getRefreshToken().equals(refreshToken)) {
                return tokenUtil.generateToken(Member.builder().email(email).build());
            }
        }
        throw new InvalidTokenException();
    }

    public void logout(String email) {
        Auth auth = refreshTokenRedisRepository.findById(email).orElseThrow(AlreadyLogoutException::new);
        refreshTokenRedisRepository.delete(auth);
    }

    public void changePassword(String email, String oldPassword, String newPassword) {
        Member member = memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new);
        if (!passwordEncoder.matches(oldPassword, member.getPassword())) {
            throw new InvalidCredentialException();
        }
        member.changePassword(passwordEncoder.encode(newPassword));
    }

    public void issueTemporaryPassword(String email, String name) {
        Member member = memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new);
        if (!member.getName().toLowerCase().equals(name.toLowerCase().trim())) {
            throw new InvalidCredentialException();
        }
        String temporaryPassword = generateRandomPassword();
        member.changePassword(passwordEncoder.encode(temporaryPassword));
        mailService.sendTemporaryPasswordMail(email, temporaryPassword);
    }

    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder();

        // 5개의 알파벳 생성
        for (int i = 0; i < 5; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }

        // 3개의 숫자 생성
        for (int i = 0; i < 3; i++) {
            sb.append(chars.charAt(rnd.nextInt(10) + 52)); // 숫자만 선택
        }

        // 생성된 문자열을 랜덤하게 섞음
        for (int i = sb.length() - 1; i > 0; i--) {
            int index = rnd.nextInt(i + 1);
            char temp = sb.charAt(index);
            sb.setCharAt(index, sb.charAt(i));
            sb.setCharAt(i, temp);
        }

        return sb.toString();
    }

    // 멤버 프로필 조회
    @Transactional(readOnly = true)
    public MemberProfileResponse getMemberProfile(CustomUser customUser, Long memberId) {
        // 현재 로그인한 사용자 조회
        Member member = memberRepository.findByEmail(customUser.getEmail()).orElseThrow(NotFoundMemberException::new);

        // 입력받은 memberId 랑 같으면 현재 로그인한 사용자 (내 프로필 조회)
        if(memberId != null) {
            // 입력받은 memberId 랑 다르면 다른 사용자 (다른 사용자 프로필 조회)
            member = memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
        }

        return MemberProfileResponse
                .builder()
                .totalAttendance(member.getTotalAttendance())
                .totalDistance(member.getTotalDistance())
                .totalTime(member.getTotalTime())
                .imageUrl(member.getImageUrl())
                .nickname(member.getNickname())
                .name(member.getName())
                .build();
    }

}
