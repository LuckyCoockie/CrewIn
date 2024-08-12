package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Course;
import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.dto.CourseRequest;
import com.luckycookie.crewin.dto.CourseRequest.CourseDetailResponse;
import com.luckycookie.crewin.dto.CourseRequest.UpdateCourseRequest;
import com.luckycookie.crewin.dto.CourseResponse;
import com.luckycookie.crewin.exception.course.NotFoundCourseException;
import com.luckycookie.crewin.exception.course.NotMatchMemberCourseException;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.repository.CourseRepository;
import com.luckycookie.crewin.repository.MemberRepository;
import com.luckycookie.crewin.security.dto.CustomUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;
    private final MemberRepository memberRepository;
    private final S3Service s3Service;

    public void createCourse(CourseRequest.CreateCourseRequest createCourseRequest, CustomUser customUser) {

        Member member = memberRepository.findByEmail(customUser.getEmail())
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

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        // id 기준 역순 정렬
        List<Course> courseList = courseRepository.findByCreatorOrderByIdDesc(member);
        return courseList.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public void updateCourse(UpdateCourseRequest updateCourseRequest, Long courseId, CustomUser customUser) {

        Member member = memberRepository.findByEmail(customUser.getEmail())
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
        Member member = memberRepository.findByEmail(customUser.getEmail())
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

    private CourseResponse convertToDto(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .name(course.getName())
                .thumbnailImage(course.getThumbnailImage())
                .courseDistance(Math.round(course.getLength() / 1000.0 * 10.0) / 10.0)
                .build();
    }
}
