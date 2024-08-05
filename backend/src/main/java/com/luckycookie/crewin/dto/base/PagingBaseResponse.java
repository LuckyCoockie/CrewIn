package com.luckycookie.crewin.dto.base;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class PagingBaseResponse <T>{
    int pageNo;
    int lastPageNo;
}

