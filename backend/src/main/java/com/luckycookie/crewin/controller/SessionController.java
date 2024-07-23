package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.domain.enums.SessionType;
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
    public ResponseEntity<BaseResponse<Void>> createPost(@AuthenticationPrincipal CustomUser customUser, @RequestBody SessionRequest.CreateSessionRequest createSessionRequest) {
        sessionService.createSession(createSessionRequest, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "세션을 등록하는데 성공했습니다."));
    }

    @GetMapping()
    public ResponseEntity<BaseResponse<List<SessionResponse>>> getSessionsByType(@RequestParam("type") String type) {
        SessionType sessionType;
        try {
            sessionType = SessionType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new NotFoundSessionTypeException();
        }
        List<SessionResponse> sessions = sessionService.getSessionsByType(sessionType);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "해당하는 타입의 세션을 조회하는데 성공했습니다.", sessions));
    }

    @GetMapping("/crew-name")
    public ResponseEntity<BaseResponse<List<SessionResponse>>> getSessionsByCrewName(@RequestParam("crew-name") String crewName, @AuthenticationPrincipal CustomUser customUser) {
        List<SessionResponse> sessions = sessionService.getSessionsByCrewName(crewName);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "해당하는 크루의 세션을 조회하는데 성공했습니다.", sessions));
    }
}
