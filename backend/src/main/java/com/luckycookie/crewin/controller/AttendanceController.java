package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.AttendanceRequest;
import com.luckycookie.crewin.dto.AttendanceRequest.StartAttendanceRequest;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

//    @PostMapping("/start/{session-id}")
//    public ResponseEntity<BaseResponse<Void>> startAttendance(@PathVariable("session-id") String sessionId, @RequestBody StartAttendanceRequest startAttendanceRequest, @AuthenticationPrincipal CustomUser customUser) {
//        attendanceService.startAttendance();
//
//    }
}
