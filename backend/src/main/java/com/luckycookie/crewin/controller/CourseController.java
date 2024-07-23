package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.CourseRequest;
import com.luckycookie.crewin.dto.CourseResponse;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/")
public class CourseController {

    private final CourseService courseService;

    @PostMapping("mypage/course")
    public ResponseEntity<BaseResponse<Void>> createCourse(@AuthenticationPrincipal CustomUser customUser, @RequestBody CourseRequest.CreateCourseRequest createCourseRequest) {
        courseService.createCourse(createCourseRequest, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.CREATED.value(), "경로를 등록하는데 성공했습니다."));
    }

    @GetMapping("mypage/course")
    public ResponseEntity<BaseResponse<List<CourseResponse>>> getAllCourse(@AuthenticationPrincipal CustomUser customUser) {
        List<CourseResponse> courseList = courseService.getAllCourse(customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "경로 리스트를 조회하는데 성공했습니다.", courseList));
    }

    @PutMapping("mypage/course/{courseId}")
    public ResponseEntity<BaseResponse<Void>> updateCourse(@AuthenticationPrincipal CustomUser customUser, @PathVariable("courseId") Long courseId, @RequestBody CourseRequest.UpdateCourseRequest updateCourseRequest) {
        courseService.updateCourse(updateCourseRequest, courseId, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "경로를 수정하는데 성공했습니다."));
    }

    @DeleteMapping("mypage/course/{courseId}")
    public ResponseEntity<Void> deleteCourse(@AuthenticationPrincipal CustomUser customUser, @PathVariable("courseId") Long courseId) {
        courseService.deleteCourse(courseId, customUser);
        return ResponseEntity.noContent().build();
    }
}
