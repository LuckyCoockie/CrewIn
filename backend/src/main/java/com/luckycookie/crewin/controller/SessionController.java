package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.domain.enums.SessionType;
import com.luckycookie.crewin.dto.*;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.SessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/session")
@Slf4j
public class SessionController {

    private final SessionService sessionService;

    // 세션 생성
    @PostMapping()
    public ResponseEntity<BaseResponse<Void>> createSession(@RequestBody SessionRequest.CreateSessionRequest createSessionRequest, @AuthenticationPrincipal CustomUser customUser) {
        sessionService.createSession(createSessionRequest, customUser);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(BaseResponse.create(HttpStatus.CREATED.value(), "세션을 등록하는데 성공했습니다."));
    }

    // 세션 조회
    @GetMapping()
    public ResponseEntity<BaseResponse<List<SessionResponse>>> getSessionsByType(
            @RequestParam(value = "status", defaultValue = "") String status,
            @RequestParam(value = "sessionType", defaultValue = "") String sessionType,
            @RequestParam(value = "crewname", defaultValue = "") String crewName) {
        SessionType enumSessionType = SessionType.stringToSessionType(sessionType);
        List<SessionResponse> sessions = sessionService.getSessionsByStatusAndTypeAndCrewName(status, enumSessionType, crewName);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "세션 정보를 조회하는데 성공했습니다.", sessions));
    }


    // 세션 상세 조회
    @GetMapping("/detail/{id}")
    public ResponseEntity<BaseResponse<SessionDetailResponse>> getSessionDetail(@PathVariable("id") Long sessionId, @AuthenticationPrincipal CustomUser customUser) {
        SessionDetailResponse sessionDetailResponse = sessionService.getSessionDetail(sessionId, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "해당하는 세션의 세부정보를 조회하는데 성공했습니다.", sessionDetailResponse));
    }

    // 세션 수정
    @PutMapping("/detail/{id}")
    public ResponseEntity<BaseResponse<Void>> updateSession(@PathVariable("id") Long sessionId, @RequestBody SessionRequest.UpdateSessionRequest updateSessionRequest, @AuthenticationPrincipal CustomUser customUser) {
        sessionService.updateSession(sessionId, updateSessionRequest, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "세션 정보를 수정하는데 성공했습니다."));
    }

    // 세션 삭제
    @DeleteMapping("/detail/{id}")
    public ResponseEntity<BaseResponse<Void>> deleteSession(@PathVariable("id") Long sessionId, @AuthenticationPrincipal CustomUser customUser) {
        sessionService.deleteSession(sessionId, customUser);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    // 세션 사진첩(갤러리) 조회 - 페이징
    @GetMapping("/detail/gallery/{sessionId}")
    public ResponseEntity<BaseResponse<SessionImageResponse.SessionGalleryItemsResponse>> getSessionGalleryList(@AuthenticationPrincipal CustomUser customUser, @PathVariable("sessionId") Long sessionId, @RequestParam int pageNo) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "세션 사진첩 조회를 성공했습니다.", sessionService.getSessionGallery(pageNo, sessionId, customUser)));
    }

    // 세션 참가 신청
    @PostMapping
    public ResponseEntity<BaseResponse<Void>> applySession(SessionRequest.ApplySessionRequest sessionRequest, @AuthenticationPrincipal CustomUser customUser) {
        sessionService.applySession(sessionRequest.getSessionId(), customUser.getEmail());

    }

}
