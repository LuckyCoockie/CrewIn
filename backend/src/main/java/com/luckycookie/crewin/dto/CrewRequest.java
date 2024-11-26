package com.luckycookie.crewin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luckycookie.crewin.domain.enums.Position;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class CrewRequest {

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrewInfoRequest {

        private String name; // 크루명
        private String slogan; // 슬로건
        private String area; // 지역
        private String introduction; // 소개

        // main logo image
        @Setter
        private String mainLogo;
        // sub logo image
        @Setter
        private String subLogo;
        // banner image
        @Setter
        private String banner;

        @DateTimeFormat(pattern = "yyyy-MM-dd")
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate crewBirth; // 크루 생일

    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CreateCrewNoticeRequest {
        private Long crewId; // crewId
        private String title; // 공지글 제목
        private String content; // 공지글 내용
        private List<String> noticeImages = new ArrayList<>(); // 공지 이미지 List
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UpdateCrewPositionRequest {
        private Long memberId;
        private Long crewId;
        private Position position; // 회원의 직급
    }

    // 초대 당한 사람 (강퇴 당한 사람)
    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrewMemberRequest {
        private Long memberId; // 초대 당한 사람의 memberId (강퇴 당한 사람)
        private Long crewId; // 초대한 사람의 crewId (강퇴 당한 사람)
    }

    // 초대 당한 사람의 응답
    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrewReplyMemberRequest {
        private Long crewId; // 초대한 사람의 crewId
        private Long noticeId;
        private Boolean replyStatus; // 수락인지, 거절인지 (수락이면 true, 거절이면 false)
    }

}
