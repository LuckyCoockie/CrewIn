package com.luckycookie.crewin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
public class MyPageResponse {

    @Getter
    @NoArgsConstructor
    @SuperBuilder
    @AllArgsConstructor
    public static class MyPageItemBaseResponse {
        int pageNo;
        int lastPageNo;
    }

    @Getter
    @NoArgsConstructor
    @Builder
    @AllArgsConstructor
    public static class MyProfileResponse {
        private String imageUrl;
        private String nickname;
        private int totalDistance;
        private int totalTime;
        private int totalAttendance;
    }

    @Getter
    @NoArgsConstructor
    @Builder
    @AllArgsConstructor
    public static class MyPageSessionItem{
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime startAt; // 시작 시간

        private String sessionName; // 세션명
        private String imageUrl; // 세션 포스터 이미지 (첫번째)
        private Long sessionId; // 세션 ID
    }

    @Getter
    @NoArgsConstructor
    @SuperBuilder
    @AllArgsConstructor
    public static class MyPageSessionResponse extends MyPageItemBaseResponse{
        List<MyPageSessionItem> sessions;
    }

}
