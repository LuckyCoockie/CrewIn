package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.domain.Token;
import com.luckycookie.crewin.dto.MemberRequest.*;
import com.luckycookie.crewin.dto.MemberResponse.DuplicateResponse;
import com.luckycookie.crewin.dto.MemberResponse.EmailResponse;
import com.luckycookie.crewin.dto.MemberResponse.MemberProfileResponse;
import com.luckycookie.crewin.dto.TokenResponse;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.exception.security.InvalidTokenException;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.MailService;
import com.luckycookie.crewin.service.MemberService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", token.getRefreshToken()).path("/")
                .secure(true).httpOnly(true).maxAge(Duration.ofDays(7L)).build();
        log.info("refreshToken 발급: {}", responseCookie.getValue());
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .body(BaseResponse.create(HttpStatus.OK.value(), "로그인에 성공했습니다.", TokenResponse.builder().accessToken(token.getAccessToken()).memberId(token.getMemberId()).build()));
    }

    @PostMapping("/signup")
    public ResponseEntity<BaseResponse<Void>> signUp(@RequestBody SignUpRequest signUpRequest) {
        memberService.signUp(signUpRequest);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "회원가입 되었습니다."));
    }

    @GetMapping("/check-email")
    public ResponseEntity<BaseResponse<DuplicateResponse>> checkDuplicateEmail(String email) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "이메일 중복 여부를 성공적으로 조회했습니다.", new DuplicateResponse(memberService.checkDuplicateEmail(email))));
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<BaseResponse<DuplicateResponse>> checkDuplicateNickname(String nickname) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "닉네임 중복 여부를 성공적으로 조회했습니다.", new DuplicateResponse(memberService.checkDuplicateNickname(nickname))));
    }

    @PostMapping("/signup/email")
    public ResponseEntity<BaseResponse<Void>> sendAuthenticationMail(@RequestBody EmailRequest emailRequest) {
        mailService.sendAuthenticationMail(emailRequest.getEmail());
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "인증번호 전송이 완료되었습니다."));
    }

    @GetMapping("/signup/email")
    public ResponseEntity<BaseResponse<EmailResponse>> checkMail(String email, String code) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "인증 여부를 성공적으로 조회했습니다.",
                EmailResponse.builder().isVerified(mailService.checkMail(email, code)).build()
        ));
    }

    @PostMapping("/reissue")
    public ResponseEntity<BaseResponse<TokenResponse>> reissue(@CookieValue(value = "refreshToken", required = false) Cookie refreshTokenCookie, HttpServletRequest request) {
        String refreshToken = refreshTokenCookie.getValue();
        if (StringUtils.isEmpty(refreshToken)) {
            throw new InvalidTokenException();
        }

        Token token = memberService.reissue(refreshToken, request);
        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", token.getRefreshToken()).path("/")
                .secure(true).httpOnly(true).maxAge(Duration.ofDays(7L)).build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .body(BaseResponse.create(HttpStatus.OK.value(), "토큰 재발급에 성공했습니다.", TokenResponse.builder().accessToken(token.getAccessToken()).memberId(token.getMemberId()).build()));
    }

    @PostMapping("/logout")
    public ResponseEntity<BaseResponse<Void>> logout(@AuthenticationPrincipal CustomUser customUser) {
        memberService.logout(customUser.getEmail());
        ResponseCookie responseCookie = ResponseCookie.from("refreshToken").path("/").maxAge(0).build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .body(BaseResponse.create(HttpStatus.OK.value(), "로그아웃 되었습니다."));
    }

    @PostMapping("/password")
    public ResponseEntity<BaseResponse<Void>> temporaryPassword(@RequestBody TemporaryPasswordRequest temporaryPasswordRequest) {
        memberService.issueTemporaryPassword(temporaryPasswordRequest.getEmail(), temporaryPasswordRequest.getName());
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "임시 비밀번호 발급이 완료되었습니다."));
    }

    @PutMapping("/password")
    public ResponseEntity<BaseResponse<Void>> changePassword(@AuthenticationPrincipal CustomUser customUser, @RequestBody ChangePasswordRequest changePasswordRequest) {
        memberService.changePassword(customUser.getEmail(), changePasswordRequest.getOldPassword(), changePasswordRequest.getNewPassword());
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "비밀번호가 변경되었습니다."));
    }

    // 사용자 프로필 조회
    @GetMapping({"/profile", "/profile/{member-id}"})
    public ResponseEntity<BaseResponse<MemberProfileResponse>> getMemberProfile(@AuthenticationPrincipal CustomUser customUser, @PathVariable(value = "member-id", required = false) Long memberId) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "사용자 프로필 조회를 성공했습니다.", memberService.getMemberProfile(customUser, memberId)));
    }

}