package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Heart;
import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HeartRepository extends JpaRepository<Heart, Long> {
    int countByPostId(Long postId);

    boolean existsByPostAndMember(Post post, Member member);
}
