package com.luckycookie.crewin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luckycookie.crewin.domain.enums.Position;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
public class CrewResponse {

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrewCreateResponse {
        long crewId;
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @SuperBuilder
    public static class CrewItem {
        private Long crewId;
        private String crewName; // 크루명
        private String slogan; // 슬로건
        private String area; // 활동 지역
        private int crewCount;
        private String captainName; // 크루장
        private String imageUrl; // 크루 이미지
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @SuperBuilder
    public static class MyCrewItem extends CrewItem {
        private Position position;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MyCrewItemResponse {
        List<MyCrewItem> crews;
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @SuperBuilder
    public static class CrewInfoItem extends CrewItem {
        private String introduction; // 크루 소개 문구

        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate crewBirth; // 크루 생성일
    }

    // 크루 공지사항 조회
    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class CrewNoticeItem {
        private Long noticeId; // 게시글 ID
        private Position position; // position
        private String title; // 공지 제목

        // 날짜
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createdAt;
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime updatedAt;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrewMemberItem {
        private Long memberId;
        private String nickname; // 닉네임
        private String name; // 이름
        private String email; // 이메일
        private String imageUrl; // 프로필사진 url
        private boolean isJoined; // 가입 여부
        private boolean isInvited; // 초대 여부
        private Position position; // 직급
        private int attendanceCount; // 크루 세션 참여 횟수
    }
}
