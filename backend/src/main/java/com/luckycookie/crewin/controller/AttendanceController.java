package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.base.BaseResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    @PostMapping("/start/{session-id}")
    public ResponseEntity<BaseResponse<Void>> startAttendanceCheck(@PathVariable("session-id") String sessionId, ) {

    }
}
