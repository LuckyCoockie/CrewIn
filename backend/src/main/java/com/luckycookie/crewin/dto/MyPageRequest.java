package com.luckycookie.crewin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class MyPageRequest {

    @Getter
    @NoArgsConstructor
    @Builder
    @AllArgsConstructor
    public static class MyPageNicknameRequest{
        private String nickname;
    }

}
