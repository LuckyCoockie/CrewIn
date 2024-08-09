package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.domain.enums.SessionType;
import com.luckycookie.crewin.dto.*;
import com.luckycookie.crewin.dto.SessionRequest.UpdateSessionRequest;
import com.luckycookie.crewin.dto.SessionRequest.UploadSessionImageRequest;
import com.luckycookie.crewin.dto.SessionResponse.SessionDetailResponse;
import com.luckycookie.crewin.dto.SessionResponse.SessionGalleryItem;
import com.luckycookie.crewin.dto.SessionResponse.SessionItem;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.dto.base.PagingItemsResponse;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.SessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RequiredArgsConstructor
@RestController
@RequestMapping("/session")
@Slf4j
public class SessionController {

    private final SessionService sessionService;

    // 세션 생성
    @PostMapping()
    public ResponseEntity<BaseResponse<SessionResponse.SessionCreateResponse>> createSession(@RequestBody SessionRequest.CreateSessionRequest createSessionRequest, @AuthenticationPrincipal CustomUser customUser) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(BaseResponse.create(HttpStatus.CREATED.value(), "세션을 등록하는데 성공했습니다.", sessionService.createSession(createSessionRequest, customUser)));
    }

    // 세션 조회
    @GetMapping()
    public ResponseEntity<BaseResponse<PagingItemsResponse<SessionItem>>> getSessionsByType(
            @RequestParam(value = "status", defaultValue = "") String status,
            @RequestParam(value = "type", defaultValue = "") String type,
            @RequestParam(value = "crew-name", defaultValue = "") String crewName,
            @RequestParam(value = "date", required = false) LocalDate date,
            @RequestParam("page-no") int pageNo) {
        SessionType enumSessionType = SessionType.stringToSessionType(type);
        PagingItemsResponse<SessionItem> sessions = sessionService.getSessionsByStatusAndTypeAndCrewNameAndDate(status, enumSessionType, crewName, date, pageNo);
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
    public ResponseEntity<BaseResponse<Void>> updateSession(@PathVariable("id") Long sessionId, @RequestBody UpdateSessionRequest updateSessionRequest, @AuthenticationPrincipal CustomUser customUser) {
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
    @GetMapping("/detail/gallery/{session-id}")
    public ResponseEntity<BaseResponse<PagingItemsResponse<SessionGalleryItem>>> getSessionGalleryList(@AuthenticationPrincipal CustomUser customUser, @PathVariable("session-id") Long sessionId, @RequestParam("page-no") int pageNo) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "세션 사진첩 조회를 성공했습니다.", sessionService.getSessionGallery(pageNo, sessionId, customUser)));
    }

    // 세션 참가 신청
    @PostMapping("/{session-id}")
    public ResponseEntity<BaseResponse<Void>> applySession(@PathVariable("session-id") Long sessionId, @AuthenticationPrincipal CustomUser customUser) {
        sessionService.applySession(sessionId, customUser.getEmail());
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "세션 참가 신청이 완료되었습니다."));
    }

    // 세션 참가 취소
    @DeleteMapping("/{session-id}")
    public ResponseEntity<BaseResponse<Void>> cancelSessionRequest(@PathVariable("session-id") Long sessionId, @AuthenticationPrincipal CustomUser customUser) {
        sessionService.cancelSessionRequest(sessionId, customUser.getEmail());
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "세션 참가 취소가 완료되었습니다."));
    }

    // 세션 사진첩 사진 업로드
    @PostMapping("/detail/gallery")
    public ResponseEntity<BaseResponse<Void>> uploadSessionImage(@AuthenticationPrincipal CustomUser customUser, @RequestBody UploadSessionImageRequest uploadSessionImageRequest) {
        sessionService.uploadSessionImage(uploadSessionImageRequest, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "세션 사진 업로드를 성공했습니다."));
    }

    // 세션 사진 삭제
    @DeleteMapping("detail/gallery/{id}")
    public ResponseEntity<BaseResponse<Void>> deleteSessionImage(@PathVariable("id") Long sessionImageId, @AuthenticationPrincipal CustomUser customUser) {
        sessionService.deleteSessionImage(sessionImageId, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "세션 사진 삭제가 완료되었습니다."));
    }

}
