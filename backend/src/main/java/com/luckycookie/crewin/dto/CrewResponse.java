package com.luckycookie.crewin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
public class CrewResponse {

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrewItem{
        private Long id;
        private String name;
        private String slogan;
        private String area;
        private int crewCount;
        private String captainName;
        private String imageUrl;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrewItemResponse{
        List<CrewItem> crews;
        int pageNo;
        int lastPageNo;
    }

}
