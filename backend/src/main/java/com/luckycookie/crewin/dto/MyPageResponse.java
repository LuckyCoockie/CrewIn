package com.luckycookie.crewin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class MyPageResponse {

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

}
