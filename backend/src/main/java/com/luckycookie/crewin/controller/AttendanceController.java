package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.AttendanceRequest.AttendanceInfoRequest;
import com.luckycookie.crewin.dto.AttendanceResponse.AttendanceMemberResponse;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    // 출석체크 시작
    @PostMapping("/start/{session-id}")
    public ResponseEntity<BaseResponse<Void>> startAttendance(@PathVariable("session-id") Long sessionId, @RequestBody AttendanceInfoRequest attendanceInfoRequest, @AuthenticationPrincipal CustomUser customUser) {
        attendanceService.startAttendance(sessionId, customUser.getEmail(), attendanceInfoRequest);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "출석이 정상적으로 시작되었습니다."));
    }

    // 참가자 출석
    @PostMapping("/guest/{session-id}")
    public ResponseEntity<BaseResponse<Void>> attend(@PathVariable("session-id") Long sessionId, @AuthenticationPrincipal CustomUser customUser, @RequestBody AttendanceInfoRequest attendanceInfoRequest) {
        attendanceService.attend(sessionId, customUser.getEmail(), attendanceInfoRequest);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "출석이 정상적으로 처리되었습니다."));
    }

    // 출석체크 수정
    @PutMapping("/{member-session-id}")
    public ResponseEntity<BaseResponse<Void>> updateAttendance(@PathVariable("member-session-id") Long memberSessionId, @RequestParam("attend") boolean attendValue, @AuthenticationPrincipal CustomUser customUser) {
        attendanceService.updateAttendance(memberSessionId, attendValue, customUser.getEmail());
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "출석이 정상적으로 수정되었습니다."));
    }

    // 출석부 목록 조회
    @GetMapping("/member/{session-id}")
    public ResponseEntity<BaseResponse<AttendanceMemberResponse>> getAttendanceMemberList(@PathVariable("session-id") Long sessionId, @AuthenticationPrincipal CustomUser customUser) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "출석부 목록 조회를 성공했습니다.", attendanceService.getAttendanceMemberList(sessionId, customUser)));
    }
}

