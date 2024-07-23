package com.luckycookie.crewin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luckycookie.crewin.domain.enums.Position;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
public class CrewResponse {

    // pagenation
    @Getter
    @SuperBuilder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrewItemBaseResponse{
        int pageNo;
        int lastPageNo;
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @SuperBuilder
    public static class CrewItem{
        private Long id;
        private String name; // 크루명
        private String slogan; // 슬로건
        private String area; // 활동 지역
        private int crewCount;
        private String captainName; // 크루장
        private String imageUrl; // 크루 이미지
    }

    @Getter
    @SuperBuilder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrewItemResponse extends CrewItemBaseResponse {
        List<CrewItem> crews;
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @SuperBuilder
    public static class CrewInfoItem extends CrewItem{
        private String infoText; // 크루 소개 문구
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
    }

    @Getter
    @SuperBuilder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrewNoticeItemResponse extends CrewItemBaseResponse {
        List<CrewNoticeItem> crewNoticeList;
    }


}
