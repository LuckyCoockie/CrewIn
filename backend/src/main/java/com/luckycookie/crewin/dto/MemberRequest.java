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
    public static class SignInRequest {
        private String email;
        private String password;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SignUpRequest {
        private String name;
        private String nickname;
        private String email;
        private String password;
    }

    @Getter
    @NoArgsConstructor
    @Builder
    @AllArgsConstructor
    public static class EmailRequest {
        private String email;
    }

    @Getter
    @NoArgsConstructor
    @Builder
    @AllArgsConstructor
    public static class TemporaryPasswordRequest {
        private String email;
        private String name;
    }

    @Getter
    @NoArgsConstructor
    @Builder
    @AllArgsConstructor
    public static class ChangePasswordRequest {
        String newPassword;
        String oldPassword;
    }
}
