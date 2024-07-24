package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Course;
import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.dto.CourseRequest;
import com.luckycookie.crewin.dto.CourseResponse;
import com.luckycookie.crewin.exception.course.NotFoundCourseException;
import com.luckycookie.crewin.exception.course.NotMatchMemberCourseError;
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

    public void createCourse(CourseRequest.CreateCourseRequest createCourseRequest, CustomUser customUser) {

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        Course course = Course
                .builder()
                .creator(member)
                .info(createCourseRequest.getInfo())
                .name(createCourseRequest.getName())
                .length(createCourseRequest.getLength())
                .thumbnailImage(createCourseRequest.getThumbnailImage())
                .build();
        courseRepository.save(course);

    }

    public List<CourseResponse> getAllCourse(CustomUser customUser) {

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        List<Course> courseList = courseRepository.findByCreatorId(member.getId());
        return courseList.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public void updateCourse(CourseRequest.UpdateCourseRequest updateCourseRequest, Long courseId, CustomUser customUser) {

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Course course = courseRepository.findById(courseId)
                .orElseThrow(NotFoundCourseException::new);
        if (!course.getCreator().equals(member)) {
            throw new NotMatchMemberCourseError();
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
            throw new NotMatchMemberCourseError();
        }
        courseRepository.delete(course);
    }


    private CourseResponse convertToDto(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .info(course.getInfo())
                .name(course.getName())
                .length(course.getLength())
                .build();
    }
}
