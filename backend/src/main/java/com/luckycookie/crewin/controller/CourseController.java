package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.CourseRequest;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/mypage/course")
public class CourseController {

    private final CourseService courseService;
    @PostMapping()
    public ResponseEntity<BaseResponse<Void>> createCourse(@AuthenticationPrincipal CustomUser customUser, @RequestBody CourseRequest.CreateCourseRequest createCourseRequest) {
        courseService.createCourse(createCourseRequest, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.CREATED.value(), "경로를 등록하는데 성공했습니다."));
    }
}
