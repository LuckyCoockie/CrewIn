package com.luckycookie.crewin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class MemberResponse {
    @Getter
    @NoArgsConstructor
    @Builder
    @AllArgsConstructor
    public static class EmailResponse {
        private boolean isVerified;
    }

    @Getter
    @NoArgsConstructor
    @Builder
    @AllArgsConstructor
    public static class DuplicateResponse {
        private boolean isDuplicated;
    }
}
