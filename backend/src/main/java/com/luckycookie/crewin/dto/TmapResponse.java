package com.luckycookie.crewin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
}
