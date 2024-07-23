package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByCreatorId(Long creatorId);
}
