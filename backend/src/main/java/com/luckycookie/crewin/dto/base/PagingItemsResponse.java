package com.luckycookie.crewin.dto.base;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@SuperBuilder
@AllArgsConstructor
public class PagingItemsResponse<T> extends PagingBaseResponse<T> {
    List<T> items;
}
