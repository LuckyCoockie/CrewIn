package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Course;
import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.dto.CourseRequest;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.repository.CourseRepository;
import com.luckycookie.crewin.repository.MemberRepository;
import com.luckycookie.crewin.security.dto.CustomUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .build();
        courseRepository.save(course);

    }
}
