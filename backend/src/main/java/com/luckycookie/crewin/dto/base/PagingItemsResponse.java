package com.luckycookie.crewin.dto.base;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Getter
@SuperBuilder
@AllArgsConstructor
public class PagingItemsResponse<T> extends PagingBaseResponse<T> {
    @Builder.Default
    List<T> items = new ArrayList<>();
}
