package com.luckycookie.crewin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luckycookie.crewin.domain.enums.Position;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.format.annotation.DateTimeFormat;

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

    // pagenation
    @Getter
    @SuperBuilder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrewItemBaseResponse {
        int pageNo;
        int lastPageNo;
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @SuperBuilder
    public static class CrewItem{
        private Long crewId;
        private String crewName; // 크루명
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
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MyCrewItemResponse {
        List<CrewItem> crews;
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @SuperBuilder
    public static class CrewInfoItem extends CrewItem{
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
    @SuperBuilder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrewNoticeItemResponse extends CrewItemBaseResponse {
        List<CrewNoticeItem> crewNoticeList;
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class CrewGalleryItem {
        private Long postId; // 게시글 ID
        private List<String> imageUrls; // 이미지 List
    }

    @Getter
    @SuperBuilder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrewGalleryItemResponse extends CrewItemBaseResponse {
        List<CrewGalleryItem> crewGalleryList;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrewMemberItem{
        private String nickname; // 닉네임
        private String name; // 이름
        private String email; // 이메일
        private boolean isJoined; // 가입 여부
        private boolean isInvited; // 초대 여부
        private Position position; // 직급
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrewMemberItemResponse{
        List<CrewMemberItem> crewIsJoinedMemberList; // 일반 회원
        List<CrewMemberItem> crewIsInvitedMemberList; // 대기 중인 회원
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrewGalleryDetailItem{
        // 게시글 작성자 nickname
        private String nickname;
        // 작성자 profile image
        private String profileImageUrl;
        // 게시물 사진 List
        private List<String> postImageUrls;
        // 하트 개수
        private int heartCount;
        // 작성자가 하트 눌렀는지 안눌렀는지
        private boolean isHearted;
        // 작성자 id
        private Long memberId;
        // 게시글 내용
        private String content;
        // 작성일
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createdAt;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrewGalleryDetailItemResponse{
        List<CrewGalleryDetailItem> crewGalleryDetailList;
    }


}
