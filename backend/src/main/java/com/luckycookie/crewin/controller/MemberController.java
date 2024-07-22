package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.domain.Token;
import com.luckycookie.crewin.dto.MemberRequest.SignInRequest;
import com.luckycookie.crewin.dto.MemberRequest.SignUpRequest;
import com.luckycookie.crewin.dto.TokenResponse;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.Duration;

@Controller
@RequiredArgsConstructor
@Slf4j
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/login")
    public ResponseEntity<BaseResponse<TokenResponse>> signIn(@RequestBody SignInRequest signInRequest) {
        Token token = memberService.signIn(signInRequest);
        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", token.getRefreshToken()).httpOnly(true)
                .secure(true).maxAge(Duration.ofDays(7L)).build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .body(BaseResponse.create(HttpStatus.OK.value(), "로그인에 성공했습니다.", TokenResponse.builder().accessToken(token.getAccessToken()).build()));
    }

    @PostMapping("/signup")
    public ResponseEntity<BaseResponse<Void>> signUp(@RequestBody SignUpRequest signUpRequest) {
        memberService.signUp(signUpRequest);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "회원가입 되었습니다."));
    }
}
