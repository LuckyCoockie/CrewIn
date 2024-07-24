package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.domain.enums.SessionType;
import com.luckycookie.crewin.dto.SessionDetailResponse;
import com.luckycookie.crewin.dto.SessionRequest;
import com.luckycookie.crewin.dto.SessionResponse;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.exception.session.NotFoundSessionTypeException;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/session")
public class SessionController {

    private final SessionService sessionService;

    @PostMapping()
    public ResponseEntity<BaseResponse<Void>> createPost(@RequestBody SessionRequest.CreateSessionRequest createSessionRequest, @AuthenticationPrincipal CustomUser customUser) {
        sessionService.createSession(createSessionRequest, customUser);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(BaseResponse.create(HttpStatus.CREATED.value(), "세션을 등록하는데 성공했습니다."));
    }

    @GetMapping()
    public ResponseEntity<BaseResponse<List<SessionResponse>>> getSessionsByType(@RequestParam("type") String type) {
        List<SessionResponse> sessions;

        if (type.equalsIgnoreCase("all")) {
            sessions = sessionService.getAllSessions();
        } else {
            try {
                SessionType sessionType = SessionType.valueOf(type.toUpperCase());
                sessions = sessionService.getSessionsByType(sessionType);
            } catch (IllegalArgumentException e) {
                throw new NotFoundSessionTypeException();
            }
        }

        String message = type.equalsIgnoreCase("ALL") ? "모든 세션을 조회하는데 성공했습니다." : "해당하는 타입의 세션을 조회하는데 성공했습니다.";
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), message, sessions));
    }

    @GetMapping("/crew-name")
    public ResponseEntity<BaseResponse<List<SessionResponse>>> getSessionsByCrewName(@RequestParam("crew-name") String crewName, @AuthenticationPrincipal CustomUser customUser) {
        List<SessionResponse> sessions = sessionService.getSessionsByCrewName(crewName);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "해당하는 크루의 세션을 조회하는데 성공했습니다.", sessions));
    }

    @GetMapping("/detail")
    public ResponseEntity<BaseResponse<SessionDetailResponse>> getSessionDetail(@RequestParam("id") Long sessionId, @AuthenticationPrincipal CustomUser customUser) {
        SessionDetailResponse sessionDetailResponse = sessionService.getSessionDetail(sessionId, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "해당하는 세션의 세부정보를 조회하는데 성공했습니다.", sessionDetailResponse));
    }

    @PutMapping("/detail")
    public ResponseEntity<BaseResponse<Void>> updatePost(@RequestParam("id") Long sessionId, @RequestBody SessionRequest.UpdateSessionRequest updateSessionRequest, @AuthenticationPrincipal CustomUser customUser) {
        sessionService.updateSession(sessionId, updateSessionRequest, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "세션 정보를 수정하는데 성공했습니다."));
    }

    @DeleteMapping("/detail")
    public ResponseEntity<BaseResponse<Void>> deletePost(@RequestParam("id") Long sessionId, @AuthenticationPrincipal CustomUser customUser) {
        sessionService.deleteSession(sessionId, customUser);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
