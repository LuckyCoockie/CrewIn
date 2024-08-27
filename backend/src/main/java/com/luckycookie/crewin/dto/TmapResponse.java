package com.luckycookie.crewin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

public class TmapResponse {

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AddressInfo {
        private String fullAddress;
        private String addressType;
        private String city_do;
        private String gu_gun;
        private String eup_myun;
        private String adminDong;
        private String adminDongCode;
        private String legalDong;
        private String legalDongCode;
        private String ri;
        private String bunji;
        private String roadName;
        private String buildingIndex;
        private String buildingName;
        private double mappingDistance;
        private String roadCode;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RouteResponse {
        private String type;
        private List<FeatureDto> features;

        @Getter
        @Builder
        @AllArgsConstructor
        @NoArgsConstructor
        public static class FeatureDto {
            private String type;
            private GeometryDto geometry;
            private PropertiesDto properties;
        }

        @Getter
        @Builder
        @AllArgsConstructor
        @NoArgsConstructor
        public static class GeometryDto {
            private String type;
            private List<Double> coordinates;
            private List<List<Double>> lineCoordinates;
        }

        @Getter
        @Builder
        @AllArgsConstructor
        @NoArgsConstructor
        public static class PropertiesDto {
            private Integer totalDistance;
            private Integer totalTime;
            private Integer index;
            private Integer pointIndex;
            private Integer lineIndex;
            private String name;
            private String description;
            private String direction;
            private String nearPoiName;
            private String nearPoiX;
            private String nearPoiY;
            private String intersectionName;
            private String facilityType;
            private String facilityName;
            private Integer turnType;
            private String pointType;
            private Integer distance;
            private Integer time;
            private Integer roadType;
            private Integer categoryRoadType;
        }
    }
}
