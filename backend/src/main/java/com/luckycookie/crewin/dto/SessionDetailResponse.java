package com.luckycookie.crewin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luckycookie.crewin.domain.enums.SessionType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class SessionDetailResponse {
    private Long sessionId;
    private Long courseId;
    private Long hostId;
    private String hostname;
    private String hostNickname;
    private String crewName;
    private String sessionName;
    private String spot;
    private String area;
    private String content;
    private Integer pace;
    private Integer maxPeople;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endAt;

    private SessionType sessionType;

    private List<String> sessionPosters;

}
