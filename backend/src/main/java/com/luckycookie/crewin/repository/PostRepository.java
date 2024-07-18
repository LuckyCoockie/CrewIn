package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p from Post p JOIN FETCH p.crew JOIN FETCH p.author ORDER BY p.createdAt DESC")
    List<Post> findAllWithCrewAndAuthorByOrderByCreatedAtDesc();
}
