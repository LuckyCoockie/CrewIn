package com.luckycookie.crewin.dto;

import lombok.*;

import java.util.List;

@NoArgsConstructor
public class PostRequest {

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class WritePostRequest {
        private String authorEmail;
        private Long crewId;
        private String title;
        private String content;
        private boolean isPublic;
        private String postType;
        List<String> postImages;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UpdatePostRequest {
        private String authorEmail;
        private Long crewId;
        private String title;
        private String content;
        private boolean isPublic;
        private String postType;
        List<String> postImages;
    }
}
