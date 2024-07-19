package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.Token;
import com.luckycookie.crewin.dto.MemberRequest;
import com.luckycookie.crewin.dto.TokenResponse;
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

    public Token login(MemberRequest.LoginRequest loginRequest) {
        Member member = memberRepository.findByEmail(loginRequest.getEmail()).orElseThrow(MemberNotFoundException::new);

        if (passwordEncoder.matches(loginRequest.getPassword(), member.getPassword())) {
            // 로그인 응답이 나가면 SecurityContextHolder에 담긴 Authentication도 사라질테니 여기서는 굳이 만들 필요 없을 듯
            // tokenUtil.makeAuthentication(member);

            return tokenUtil.generateToken(member);
        } else {
            throw new LoginFailException();
        }
    }

    public void makeAuthentication(Member member) {

    }
}
