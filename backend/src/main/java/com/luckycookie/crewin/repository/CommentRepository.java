package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Comment;
import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostOrderByIdDesc(Post post);
    Comment findByMember(Member member);
}