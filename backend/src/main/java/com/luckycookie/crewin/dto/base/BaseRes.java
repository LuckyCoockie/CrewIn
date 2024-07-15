package com.luckycookie.crewin.dto.base;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseRes<T> {
    private int statusCode;
    private String message;
    private T data;

    public static <T> BaseRes<T> create(int statusCode, String message) {
        return new BaseRes<>(statusCode, message, null);
    }

    public static <T> BaseRes<T> create(int statusCode, String message, T dto) {
        return new BaseRes<>(statusCode, message, dto);
    }

}
