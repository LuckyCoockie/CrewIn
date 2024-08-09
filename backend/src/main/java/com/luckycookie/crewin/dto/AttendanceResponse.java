package com.luckycookie.crewin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

public class AttendanceResponse {

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class AttendanceMemberResponse {
        List<AttendanceMemberItem> items;
        Boolean AutoCheckInProgress;
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class AttendanceMemberItem {
        private Long memberSessionId;
        private String name;
        private String nickname;
        private String profileUrl;
        private Boolean isAttend;
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class AttendanceInfo {
        private Long memberSessionId;
        private Boolean isAttend;
    }

}
