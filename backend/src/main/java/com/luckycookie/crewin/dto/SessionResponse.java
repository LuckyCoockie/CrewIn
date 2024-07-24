package com.luckycookie.crewin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luckycookie.crewin.domain.enums.SessionType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder

public class SessionResponse {

    private String crewName;
    private String sessionName;
    private String spot;
    private String sessionThumbnail;
    private SessionType sessionType;
    private int maxPeople;
    private long sessionId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startAt;

}
