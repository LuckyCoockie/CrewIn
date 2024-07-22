package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.Token;
import com.luckycookie.crewin.dto.MemberRequest.SignInRequest;
import com.luckycookie.crewin.dto.MemberRequest.SignUpRequest;
import com.luckycookie.crewin.exception.member.DuplicateEmailException;
import com.luckycookie.crewin.exception.member.DuplicateNicknameException;
import com.luckycookie.crewin.exception.member.LoginFailException;
import com.luckycookie.crewin.exception.member.MemberNotFoundException;
import com.luckycookie.crewin.repository.MemberRepository;
import com.luckycookie.crewin.security.util.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenUtil tokenUtil;

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

    public void checkEmail(String email) {
        if (memberRepository.existsByEmail(email)) {
            throw new DuplicateEmailException();
        }
    }

    public void checkNickname(String nickname) {
        if (memberRepository.existsByNickname(nickname)) {
            throw new DuplicateNicknameException();
        }
    }
}
