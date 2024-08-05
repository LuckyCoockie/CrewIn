package com.luckycookie.crewin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

public class MemberResponse {
    @Getter
    @NoArgsConstructor
    @Builder
    @AllArgsConstructor
    public static class EmailResponse {
        private boolean isVerified;
    }

    @Getter
    @NoArgsConstructor
    @Builder
    @AllArgsConstructor
    public static class DuplicateResponse {
        private boolean isDuplicated;
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @SuperBuilder
    public static class MemberItem {
        private Long memberId;
        private String memberNickName;
        private String memberName;
        private String profileUrl;
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @SuperBuilder
    public static class MemberItemBaseResponse {
        int pageNo;
        int lastPageNo;
    }

    @Getter
    @SuperBuilder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MemberSearchResponse extends MemberItemBaseResponse{
        List<MemberItem> members;
    }

    @Getter
    @NoArgsConstructor
    @Builder
    @AllArgsConstructor
    public static class MemberProfileResponse {
        private String imageUrl;
        private String nickname;
        private String name; // 사용자 이름
        private int totalDistance;
        private int totalTime;
        private int totalAttendance;
    }

}
