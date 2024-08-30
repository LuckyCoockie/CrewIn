package com.luckycookie.crewin.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.luckycookie.crewin.dto.CourseRequest;
import com.luckycookie.crewin.dto.CourseRequest.CourseDetailResponse;
import com.luckycookie.crewin.dto.CourseResponse;
import com.luckycookie.crewin.dto.TmapResponse.AddressInfo;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
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
    public Mono<ResponseEntity<BaseResponse<AddressInfo>>> getAddressInfo(
            @AuthenticationPrincipal CustomUser customUser,
            @RequestParam String lat,
            @RequestParam String lon) {

        return courseService.getLocationByLatLng(lat, lon)
                .map(addressInfo -> ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "주소를 가져오는데 성공했습니다.", addressInfo)))
                .onErrorResume(JsonProcessingException.class, e -> Mono.just(
                        ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BaseResponse.create(HttpStatus.BAD_REQUEST.value(), "요청 도중 문제가 발생했습니다."))))
                .onErrorResume(Exception.class, e -> Mono.just(
                        ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponse.create(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage()))));
    }

//    @PostMapping("/pedestrian")
//    public ResponseEntity<BaseResponse<RouteResponse>> getPedestrianRoute(@AuthenticationPrincipal CustomUser customUser @RequestBody RouteReq0) {}


}
