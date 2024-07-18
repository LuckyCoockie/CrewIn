package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Heart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HeartRepository extends JpaRepository<Heart, Long> {
    int countByPostId(Long postId);
}
