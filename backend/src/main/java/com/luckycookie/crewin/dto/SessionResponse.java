package com.luckycookie.crewin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luckycookie.crewin.domain.enums.SessionType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


public class SessionResponse {

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SessionCreateResponse {
        private long sessionId;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SessionItem {

        private String crewName;
        private String sessionName;
        private String spot;
        private String area;
        private String sessionThumbnail;
        private SessionType sessionType;
        private int maxPeople;
        private int currentPeople;
        private long sessionId;

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime startAt;

    }
    @Getter
    @Builder
    public static class SessionDetailResponse {
        private Long sessionId;
        private Long courseId;
        private Boolean isSessionHost;
        private String hostname;
        private String hostNickname;
        private String crewName;
        private String sessionName;
        private String spot;
        private String area;
        private String content;
        private String courseThumbnail;
        private Integer pace;
        private Integer maxPeople;
        private Integer currentPeople; // 현재 참가 중인 사람
        private Boolean isJoined; // 현재 참가 중이지 않은지
        private Double courseDistance; // 코스 길이 소수점 1자리까지 반환
        private Boolean isMyCrew; //해당 세션을 생성한 크루에 속해 있는지

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime startAt;
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime endAt;

        private SessionType sessionType;

        private List<String> sessionPosters;

    }
    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class SessionGalleryItem {
        private Long sessionImageId;
        private String imageUrl;

    }
}
