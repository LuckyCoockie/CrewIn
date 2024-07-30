package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Crew;
import com.luckycookie.crewin.domain.Post;
import com.luckycookie.crewin.domain.enums.PostType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p from Post p JOIN FETCH p.crew JOIN FETCH p.author WHERE p.isPublic = TRUE ORDER BY p.createdAt DESC, p.id DESC")
    List<Post> findPublicPostsSortedByCreatedAt();

    @Query("SELECT p FROM Post p WHERE p.crew = :crew AND p.postType = :postType ORDER BY p.createdAt DESC")
    Page<Post> findByCrewAndPostType(Crew crew, PostType postType, Pageable pageable);

}
