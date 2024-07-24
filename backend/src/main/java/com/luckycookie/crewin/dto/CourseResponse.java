package com.luckycookie.crewin.dto;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CourseResponse {
    private Long id;
    private String name;
    private String thumbnailImage;
}
