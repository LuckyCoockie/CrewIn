package com.luckycookie.crewin.dto;

import lombok.*;

import java.util.List;

@NoArgsConstructor
public class PostRequest {

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @ToString
    public static class WritePostRequest {
        private Long crewId;
        private String title;
        private String content;
        private Boolean isPublic;
        private String postType;
        List<String> postImages;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UpdatePostRequest {
        private String title;
        private String content;
        private Boolean isPublic;
        private String postType;
        List<String> postImages;
    }
}
