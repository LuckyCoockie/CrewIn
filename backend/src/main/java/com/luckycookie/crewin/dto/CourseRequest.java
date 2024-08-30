package com.luckycookie.crewin.dto;

import lombok.*;

public class CourseRequest {

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CreateCourseRequest {
        private String info;
        private String name;
        private String area;
        private Integer length;
        private String thumbnailImage ;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UpdateCourseRequest {
        private String info;
        private String name;
        private String area;
        private Integer length;
        private String thumbnailImage ;
    }

    @Getter
    @Builder
    public static class CourseDetailResponse {
        private Long id;
        private Long creatorId;
        private Integer length;
        private String area;
        private String info;
        private String name;
        private String thumbnailImage;

    }

}
