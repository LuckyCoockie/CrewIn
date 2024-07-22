package com.luckycookie.crewin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@NoArgsConstructor
public class CrewRequest {

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CreateCrewRequest{

        private String name; // 크루명
        private String slogan; // 슬로건
        private String area; // 지역
        private String introduction; // 소개

        // main logo image
        private String mainLogo;
        // sub logo image
        private String subLogo;
        // banner image
        private String banner;

        @DateTimeFormat(pattern = "yyyy-MM-dd")
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate crewBirth; // 크루 생일

    }

}
