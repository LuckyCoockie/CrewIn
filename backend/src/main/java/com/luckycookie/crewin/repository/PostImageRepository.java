package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Post;
import com.luckycookie.crewin.domain.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostImageRepository extends JpaRepository<PostImage, Long> {
    List<PostImage> findByPost(Post post);
}
