package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.NotificationResponse;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController()
@RequestMapping("/notification")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping()
    public ResponseEntity<BaseResponse<List<NotificationResponse>>> getMemberNotification(@AuthenticationPrincipal CustomUser customUser) {
        return ResponseEntity.ok(
                BaseResponse.create(HttpStatus.OK.value()
                , "해당 멤버의 알림 조회에 성공했습니다."
                , notificationService.getMemberNotifications(customUser))
        );
    }
}
