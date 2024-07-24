package com.luckycookie.crewin.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CourseDetailResponse {
    private Long id;
    private Long creatorId;
    private Double length;

    private String info;
    private String name;
    private String thumbnailImage;

}
