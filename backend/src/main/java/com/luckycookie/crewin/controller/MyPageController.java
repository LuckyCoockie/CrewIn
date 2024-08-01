package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.MyPageResponse;
import com.luckycookie.crewin.dto.MyPageResponse.MyProfileResponse;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.MyPageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/mypage")
@RequiredArgsConstructor
@Slf4j
public class MyPageController {

    private final MyPageService myPageService;

    // 내 프로필 조회
    @GetMapping()
    public ResponseEntity<BaseResponse<MyProfileResponse>> getMyProfile(@AuthenticationPrincipal CustomUser customUser) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "내 프로필 조회를 성공했습니다.", myPageService.getMyProfile(customUser)));
    }

    // 내가 만든 세션 조회
    @GetMapping("/session")
    public ResponseEntity<BaseResponse<MyPageResponse.MyPageSessionResponse>> getCreatedMySession(@AuthenticationPrincipal CustomUser customUser, @RequestParam int pageNo, @RequestParam String type) {
        if(type.equals("created")) {
            return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "내가 만든 세션 조회를 성공했습니다.", myPageService.getCreatedMySession(customUser, pageNo, type)));
        }else {
            return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "내가 참가한 세션 조회를 성공했습니다.", myPageService.getCreatedMySession(customUser, pageNo, type)));
        }
    }


}
