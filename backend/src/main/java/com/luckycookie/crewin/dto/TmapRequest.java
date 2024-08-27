package com.luckycookie.crewin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class TmapRequest {

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RouteRequest {
        private double startX;
        private double startY;
        private double endX;
        private double endY;

        @Builder.Default
        private String reqCoordType = "WGS84GEO";

        @Builder.Default
        private String resCoordType = "WGS84GEO";

        @Builder.Default
        private String startName = "출발지";

        @Builder.Default
        private String endName = "도착지";
    }

}
