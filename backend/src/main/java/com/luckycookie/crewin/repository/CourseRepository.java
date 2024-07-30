package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Course;
import com.luckycookie.crewin.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByCreator(Member creator);
}
