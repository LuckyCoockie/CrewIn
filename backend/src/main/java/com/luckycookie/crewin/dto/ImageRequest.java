package com.luckycookie.crewin.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import com.luckycookie.crewin.exception.image.ImageExtensionException;
import java.util.Arrays;

@NoArgsConstructor // 파라미터가 없는 기본 생성자 생성
public class ImageRequest {

    @AllArgsConstructor // 모든 필드 값을 파라미터로 받는 생성자 생성
    @Getter
    public enum ImageExtension {
        JPEG("jpeg"),
        JPG("jpg"),
        PNG("png");

        @JsonValue // JSON 직렬화
        private final String uploadExtension;

        @JsonCreator // JSON 역직렬화
        public static ImageExtension of(String imageExtension) {
            return Arrays.stream(ImageExtension.values())
                    .filter(e->e.uploadExtension.equals(imageExtension))
                    .findAny().orElseThrow(ImageExtensionException::new);
        }
    }


    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PresignedUrlReq{
        ImageExtension imageExtension;
    }

}
