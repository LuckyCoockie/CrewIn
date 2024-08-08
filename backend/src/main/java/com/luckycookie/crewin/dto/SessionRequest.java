package com.luckycookie.crewin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luckycookie.crewin.domain.enums.SessionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class SessionRequest {

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class CreateSessionRequest {
        private Long courseId;
        private Long crewId;

        // 세션 종류
        private SessionType sessionType;
        private String name; // 세션 이름
        // 한 세션에 포스터 여러장 가능
        private List<String> images = new ArrayList<>();
        // 평균 페이스
        private int pace;
        // 집결지 정보
        private String spot;

        // 시작 시간
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime startAt;

        // 종료 시간
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime endAt;

        private String content;
        private int maxPeople;

    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class UploadSessionImageRequest {
        private Long sessionId;
        private List<String> sessionImageUrls;
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class UpdateSessionRequest {
        private Long courseId;

        // 세션 종류
        private SessionType sessionType;
        private String name; // 세션 이름
        // 한 세션에 포스터 여러장 가능
        private List<String> images;
        // 평균 페이스
        private int pace;
        // 집결지 정보
        private String spot;

        // 시작 시간
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime startAt;

        // 종료 시간
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime endAt;

        private String content;
        private int maxPeople;

    }
}
