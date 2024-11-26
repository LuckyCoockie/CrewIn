package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.CourseRequest;
import com.luckycookie.crewin.dto.CourseRequest.CourseDetailResponse;
import com.luckycookie.crewin.dto.CourseResponse;
import com.luckycookie.crewin.dto.TmapRequest.RouteRequestWrapper;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.exception.member.MemberNotFoundException;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

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
    public ResponseEntity<BaseResponse<CourseDetailResponse>> getCourseDetail(@PathVariable("courseId") Long courseId) {
        CourseDetailResponse courseDetailResponse = courseService.getCourseDetail(courseId);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "해당 경로 상세정보를 조회하는데 성공했습니다.", courseDetailResponse));
    }

    @GetMapping("/reversegeocoding")
    public Mono<ResponseEntity<String>> getAddressInfo(
            @AuthenticationPrincipal CustomUser customUser,
            @RequestParam String lat,
            @RequestParam String lon) {

        return courseService.getLocationByLatLon(lat, lon, customUser)
                .map(response -> ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(response))
                .onErrorResume(WebClientResponseException.class, e -> Mono.just(
                        ResponseEntity.status(e.getStatusCode())
                                .body("외부 API 호출 중 오류가 발생했습니다: " + e.getMessage())))
                .onErrorResume(MemberNotFoundException.class, e -> Mono.just(
                        ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("서버 내부 오류가 발생했습니다: " + e.getMessage())));
    }

    @PostMapping("/pedestrian")
    public Mono<ResponseEntity<String>> getPedestrianRoutes(
            @AuthenticationPrincipal CustomUser customUser,
            @RequestBody RouteRequestWrapper requestWrapper) {

        return courseService.getRoutesByRouteRequests(requestWrapper.getRoutes(), customUser)
                .map(response -> ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(response))
                .onErrorResume(WebClientResponseException.class, e -> Mono.just(
                        ResponseEntity.status(e.getStatusCode())
                                .body("외부 API 호출 중 오류가 발생했습니다: " + e.getMessage())))
                .onErrorResume(MemberNotFoundException.class, e -> Mono.just(
                        ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("서버 내부 오류가 발생했습니다: " + e.getMessage())));
    }

}
