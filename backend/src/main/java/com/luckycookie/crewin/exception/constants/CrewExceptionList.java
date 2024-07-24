package com.luckycookie.crewin.exception.constants;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CrewExceptionList {
    NOT_FOUND_CREW_ERROR("C0001", HttpStatus.NOT_FOUND, "크루를 찾는데 실패했습니다."),
    CREW_LIST_ERROR("C0002", HttpStatus.BAD_REQUEST, "크루 목록을 불러오지 못했습니다."),
    CREW_POSITION_MISMATCH_ERROR("C0003", HttpStatus.BAD_REQUEST, "크루 공지는 PACER 이상만 가능합니다."),
    CREW_MEMBER_NOT_EXIST_ERROR("C0004", HttpStatus.BAD_REQUEST, "크루에 해당 멤버가 존재하지 않습니다."),
    CREW_UNAUTHORIZED_ERROR("C0005", HttpStatus.FORBIDDEN, "크루 삭제는 CAPTAIN만 가능합니다.");

    private final String errorCode;
    private final HttpStatus httpStatus;
    private final String message;

}
