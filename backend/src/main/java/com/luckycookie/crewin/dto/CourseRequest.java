package com.luckycookie.crewin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class CourseRequest {

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CreateCourseRequest {
        private String info;
        private String name;
        private Double length;
        private String thumbnailImage ;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UpdateCourseRequest {
        private String info;
        private String name;
        private Double length;
        private String thumbnailImage ;
    }
}
