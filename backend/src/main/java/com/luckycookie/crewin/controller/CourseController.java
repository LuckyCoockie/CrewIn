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
@RequestMapping("/course")
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    public ResponseEntity<BaseResponse<Void>> createCourse(@AuthenticationPrincipal CustomUser customUser, @RequestBody CourseRequest.CreateCourseRequest createCourseRequest) {
        courseService.createCourse(createCourseRequest, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.CREATED.value(), "경로를 등록하는데 성공했습니다."));
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<CourseResponse>>> getAllCourse(@AuthenticationPrincipal CustomUser customUser) {
        List<CourseResponse> courseList = courseService.getAllCourse(customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "경로 리스트를 조회하는데 성공했습니다.", courseList));
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<BaseResponse<Void>> updateCourse(@AuthenticationPrincipal CustomUser customUser, @PathVariable("courseId") Long courseId, @RequestBody CourseRequest.UpdateCourseRequest updateCourseRequest) {
        courseService.updateCourse(updateCourseRequest, courseId, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "경로를 수정하는데 성공했습니다."));
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<Void> deleteCourse(@AuthenticationPrincipal CustomUser customUser, @PathVariable("courseId") Long courseId) {
        courseService.deleteCourse(courseId, customUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<BaseResponse<CourseRequest.CourseDetailResponse>> getCourseDetail(@AuthenticationPrincipal CustomUser customUser, @PathVariable("courseId") Long courseId) {
        CourseRequest.CourseDetailResponse courseDetailResponse = courseService.getCourseDetail(courseId, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "해당 경로 상세정보를 조회하는데 성공했습니다.", courseDetailResponse));
    }
}
