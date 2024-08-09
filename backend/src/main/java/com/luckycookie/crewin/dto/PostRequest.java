package com.luckycookie.crewin.dto;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

public class PostRequest {

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @ToString
    public static class WritePostRequest {
        private Long crewId;
        private String content;
        private Boolean isPublic;
        List<String> postImages = new ArrayList<>();
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UpdatePostRequest {
        private Long crewId;
        private String title;
        private String content;
        private Boolean isPublic;
        List<String> postImages = new ArrayList<>();
    }
}
