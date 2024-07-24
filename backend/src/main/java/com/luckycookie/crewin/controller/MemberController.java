package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.domain.Token;
import com.luckycookie.crewin.dto.MemberRequest;
import com.luckycookie.crewin.dto.MemberRequest.EmailRequest;
import com.luckycookie.crewin.dto.MemberRequest.EmailResponse;
import com.luckycookie.crewin.dto.MemberRequest.SignInRequest;
import com.luckycookie.crewin.dto.MemberRequest.SignUpRequest;
import com.luckycookie.crewin.dto.TokenResponse;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.service.MailService;
import com.luckycookie.crewin.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController()
@RequestMapping("/member")
@RequiredArgsConstructor
@Slf4j
public class MemberController {

    private final MemberService memberService;
    private final MailService mailService;

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

    @GetMapping("/check-email")
    public ResponseEntity<BaseResponse<Void>> checkEmail(String email) {
        memberService.checkEmail(email);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "사용 가능한 이메일입니다."));
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<BaseResponse<Void>> checkNickname(String nickname) {
        memberService.checkNickname(nickname);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "사용 가능한 닉네임입니다."));
    }

    @PostMapping("/signup/email")
    public ResponseEntity<BaseResponse<Void>> sendMail(@RequestBody EmailRequest emailRequest) {
        mailService.sendMail(emailRequest.getEmail());
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "이메일 전송이 완료되었습니다."));
    }

    @GetMapping("/signup/email")
    public ResponseEntity<BaseResponse<EmailResponse>> checkMail(String email, String code) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "인증 여부를 성공적으로 조회했습니다.",
                EmailResponse.builder().isVerified(mailService.checkMail(email, code)).build()
        ));
    }
}