package com.luckycookie.crewin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luckycookie.crewin.domain.enums.SessionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
public class SessionRequest {

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class CreateSessionRequest {
        private Long courseId;
        private Long hostId;
        private Long crewId;

        // 세션 종류
        private SessionType sessionType;
        private String name; // 세션 이름
        // 한 세션에 포스터 여러장 가능
        private List<String> images;
        // 평균 페이스
        private int pace;
        // 코스 이름
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
