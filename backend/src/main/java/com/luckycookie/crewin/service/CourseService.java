package com.luckycookie.crewin.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.luckycookie.crewin.domain.Course;
import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.dto.CourseRequest;
import com.luckycookie.crewin.dto.CourseRequest.CourseDetailResponse;
import com.luckycookie.crewin.dto.CourseRequest.UpdateCourseRequest;
import com.luckycookie.crewin.dto.CourseResponse;
import com.luckycookie.crewin.dto.TmapRequest.RouteRequest;
import com.luckycookie.crewin.exception.course.NotFoundCourseException;
import com.luckycookie.crewin.exception.course.NotMatchMemberCourseException;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.repository.CourseRepository;
import com.luckycookie.crewin.repository.MemberRepository;
import com.luckycookie.crewin.security.dto.CustomUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CourseService {

    private final CourseRepository courseRepository;
    private final MemberRepository memberRepository;
    private final S3Service s3Service;
    private final WebClient webClient;





    public void createCourse(CourseRequest.CreateCourseRequest createCourseRequest, CustomUser customUser) {

        Member member = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        Course course = Course
                .builder()
                .creator(member)
                .info(createCourseRequest.getInfo())
                .area(createCourseRequest.getArea())
                .name(createCourseRequest.getName())
                .length(createCourseRequest.getLength())
                .thumbnailImage(createCourseRequest.getThumbnailImage())
                .build();
        courseRepository.save(course);

    }

    public List<CourseResponse> getAllCourse(CustomUser customUser) {

        Member member = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        // id 기준 역순 정렬
        List<Course> courseList = courseRepository.findByCreatorOrderByIdDesc(member);
        return courseList.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public void updateCourse(UpdateCourseRequest updateCourseRequest, Long courseId, CustomUser customUser) {

        Member member = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Course course = courseRepository.findById(courseId)
                .orElseThrow(NotFoundCourseException::new);
        if (!course.getCreator().equals(member)) {
            throw new NotMatchMemberCourseException();
        }

        if (!course.getThumbnailImage().equals(updateCourseRequest.getThumbnailImage())) {
            s3Service.deleteImage(course.getThumbnailImage());
        }

        course.updateCourse(updateCourseRequest);
        courseRepository.save(course);
    }

    public void deleteCourse(Long courseId, CustomUser customUser) {
        Member member = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Course course = courseRepository.findById(courseId)
                .orElseThrow(NotFoundCourseException::new);
        if (!course.getCreator().equals(member)) {
            throw new NotMatchMemberCourseException();
        }

        s3Service.deleteImage(course.getThumbnailImage());

        courseRepository.delete(course);
    }

    public CourseDetailResponse getCourseDetail(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(NotFoundCourseException::new);

        return CourseDetailResponse.builder()
                .id(courseId)
                .creatorId(course.getCreator().getId())
                .length(course.getLength())
                .info(course.getInfo())
                .area(course.getArea())
                .name(course.getName())
                .thumbnailImage(course.getThumbnailImage())
                .build();
    }

    public Mono<String> getRoutesByRouteRequests(List<RouteRequest> routeRequests, CustomUser customUser) {
        return Mono.fromCallable(() -> memberRepository.findFirstByEmail(customUser.getEmail())
                        .orElseThrow(NotFoundMemberException::new))
                .then(Flux.fromIterable(routeRequests)
                        .flatMap(this::getRouteByRouteRequest)
                        .collectList()
                        .map(responses -> {
                            ObjectMapper mapper = new ObjectMapper();
                            ObjectNode result = mapper.createObjectNode();
                            result.put("count", responses.size());
                            ArrayNode routesArray = result.putArray("routes");
                            for (String response : responses) {
                                try {
                                    routesArray.add(mapper.readTree(response));
                                } catch (JsonProcessingException e) {
                                    throw new RuntimeException("Error processing JSON", e);
                                }
                            }
                            try {
                                return mapper.writeValueAsString(result);
                            } catch (JsonProcessingException e) {
                                throw new RuntimeException("Error creating JSON response", e);
                            }
                        }));
    }

    private Mono<String> getRouteByRouteRequest(RouteRequest routeRequest) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("startX", String.valueOf(routeRequest.getStartX()));
        formData.add("startY", String.valueOf(routeRequest.getStartY()));
        formData.add("endX", String.valueOf(routeRequest.getEndX()));
        formData.add("endY", String.valueOf(routeRequest.getEndY()));
        formData.add("reqCoordType", routeRequest.getReqCoordType());
        formData.add("resCoordType", routeRequest.getResCoordType());
        formData.add("startName", routeRequest.getStartName());
        formData.add("endName", routeRequest.getEndName());

        return webClient.post()
                .uri("/routes/pedestrian?version=1&format=json&callback=result")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(String.class);
    }

    public Mono<String> getLocationByLatLon(String lat, String lon, CustomUser customUser) {
        return Mono.fromCallable(() -> memberRepository.findFirstByEmail(customUser.getEmail())
                        .orElseThrow(NotFoundMemberException::new))
                .then(webClient.get()
                        .uri("/geo/reversegeocoding?lat=" + lat + "&lon=" + lon + "&addressType=A10&newAddressExtend=Y")
                        .retrieve()
                        .bodyToMono(String.class))
                .doOnNext(response -> log.info("geocode api response: {}", response));
    }


    private CourseResponse convertToDto(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .name(course.getName())
                .thumbnailImage(course.getThumbnailImage())
                .courseDistance(Math.round(course.getLength() / 1000.0 * 10.0) / 10.0)
                .build();
    }
}
