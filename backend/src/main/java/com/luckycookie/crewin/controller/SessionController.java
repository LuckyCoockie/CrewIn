package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.PostRequest;
import com.luckycookie.crewin.dto.SessionRequest;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/session")
public class SessionController {

    private final SessionService sessionService;

    @PostMapping()
    public ResponseEntity<BaseResponse<Void>> createPost(@RequestBody SessionRequest.CreateSessionRequest createSessionRequest) {
        sessionService.createSession(createSessionRequest);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "세션을 등록하는데 성공했습니다."));
    }

}
