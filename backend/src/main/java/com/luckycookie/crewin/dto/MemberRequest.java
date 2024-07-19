package com.luckycookie.crewin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class MemberRequest {

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
    }

}
