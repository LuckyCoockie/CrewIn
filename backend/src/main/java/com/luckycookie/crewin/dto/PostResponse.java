package com.luckycookie.crewin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.luckycookie.crewin.domain.enums.PostType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class PostResponse {

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class PostGalleryItem {
        private Long postId;
        private String ThumbnailImage;
    }

    @Getter
    @Builder
    public static class PostItem { // SNS 게시글 Item (사진첩 상세조회도 공통)
        private Long id; // id
        private String authorName; // postType에 따라 작성자 닉네임 or 크루명 반환
        private Long authorId; // postType에 따라서 작성자 id or 크루id 반환
        private String content;
        private Integer heartCount;
        private Boolean isHearted;
        private Boolean isPublic;
        private PostType postType;
        private String profileImage;
        private String title;

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createdAt;

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime updatedAt;

        private List<String> postImages;
    }

}

