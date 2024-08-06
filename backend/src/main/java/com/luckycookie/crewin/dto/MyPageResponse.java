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
    @Builder
    @AllArgsConstructor
    public static class MyPageSessionItem{
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime startAt; // 시작 시간
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime endAt; // 종료 시간

        private String sessionName; // 세션명
        private String imageUrl; // 세션 포스터 이미지 (첫번째)
        private Long sessionId; // 세션 ID
        private String crewName; // 크루 이름
        private String area; // 코스 지역
    }

}
