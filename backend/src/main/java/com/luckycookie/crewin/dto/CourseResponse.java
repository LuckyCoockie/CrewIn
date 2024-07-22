package com.luckycookie.crewin.dto;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CourseResponse {
    private Long id;
    private String info;
    private String name;
    private Double length;
}
