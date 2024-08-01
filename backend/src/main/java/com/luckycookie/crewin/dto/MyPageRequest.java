package com.luckycookie.crewin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


public class MyPageRequest {

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UpdateProfileRequest {
        private String profileImageUrl;
    }


    @Getter
    @NoArgsConstructor
    @Builder
    @AllArgsConstructor
    public static class MyPageNicknameRequest{
        private String nickname;
    }

}
