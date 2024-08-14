package com.luckycookie.crewin.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseResponse {
    private Long id;
    private String name;
    private String thumbnailImage;
    private Double courseDistance; // 코스 길이 소수점 1자리까지 반환
}
