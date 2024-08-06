package com.luckycookie.crewin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luckycookie.crewin.domain.enums.SessionType;
import lombok.*;

import java.time.LocalDateTime;


public class SessionResponse {

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
        private long sessionId;

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime startAt;

    }
}
