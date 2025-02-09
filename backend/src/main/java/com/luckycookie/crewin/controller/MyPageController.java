package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.MyPageRequest;
import com.luckycookie.crewin.dto.MyPageRequest.MyPageNicknameRequest;
import com.luckycookie.crewin.dto.MyPageResponse;
import com.luckycookie.crewin.dto.MyPageResponse.MyPageSessionItem;
import com.luckycookie.crewin.dto.PostResponse;
import com.luckycookie.crewin.dto.PostResponse.PostGalleryItem;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.dto.base.PagingItemsResponse;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.MyPageService;
import com.luckycookie.crewin.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/mypage")
@RequiredArgsConstructor
@Slf4j
public class MyPageController {

    private final MyPageService myPageService;
    private final PostService postService;

    // 내가 만든, 내가 신청한 세션 조회
    @GetMapping("/session")
    public ResponseEntity<BaseResponse<PagingItemsResponse<MyPageSessionItem>>> getCreatedMySession(@AuthenticationPrincipal CustomUser customUser, @RequestParam("page-no") int pageNo, @RequestParam(value = "type", required = false) String type, @RequestParam(value = "session-type", required = false) String sessionType) {
        if(type.equals("created")) {
            return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "내가 만든 세션 조회를 성공했습니다.", myPageService.getCreatedMySession(customUser, pageNo, type, sessionType)));
        }else {
            return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "내가 신청한 세션 조회를 성공했습니다.", myPageService.getCreatedMySession(customUser, pageNo, type, sessionType)));
        }
    }

    // 프로필 사진 업데이트
    @PutMapping("/profile/image")
    public ResponseEntity<BaseResponse<Void>> updateProfileImage(@AuthenticationPrincipal CustomUser customUser, @RequestBody MyPageRequest.UpdateProfileRequest updateProfileRequest) {
        myPageService.updateProfileImage(customUser, updateProfileRequest);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "프로필 사진 변경을 완료했습니다!."));
    }

    // 닉네임 변경
    @PutMapping("/profile/nickname")
    public ResponseEntity<BaseResponse<Void>> updateNickname(@AuthenticationPrincipal CustomUser customUser, @RequestBody MyPageNicknameRequest myPageNicknameRequest) {
        myPageService.changeNickname(customUser, myPageNicknameRequest);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "닉네임을 변경하는데 성공했습니다."));
    }

}
