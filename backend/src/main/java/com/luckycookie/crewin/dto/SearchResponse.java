package com.luckycookie.crewin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

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

    @Getter
    @SuperBuilder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BasePageResponse {
        int pageNo;
        int lastPageNo;
    }

    @Getter
    @SuperBuilder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MemberInvitationPageResponse extends BasePageResponse {
        List<MemberInvitationResponse> members;
    }
}