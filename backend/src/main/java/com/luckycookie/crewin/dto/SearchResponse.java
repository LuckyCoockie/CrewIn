package com.luckycookie.crewin.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SearchResponse {

    @Getter
    @Builder
    public static class MemberInvitationResponse {
        private Long memberId;
        private String name;
        private String nickname;
        private String imageUrl;
        private Integer attendanceCount;
        private Boolean isJoined;
        private Boolean isInvited;
    }
}