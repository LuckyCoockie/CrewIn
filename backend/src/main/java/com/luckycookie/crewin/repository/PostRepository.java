package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Crew;
import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.Post;
import com.luckycookie.crewin.domain.enums.PostType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("select p from Post p join fetch p.crew where p.id = :id")
    Optional<Post> findByIdWithCrew(Long id);

    @Query("SELECT p from Post p JOIN FETCH p.author WHERE (p.isPublic = true) OR (p.crew.id IN :crews) ORDER BY p.createdAt DESC, p.id DESC")
    Page<Post> findPublicPostsSortedByCreatedAt(List<Long> crews, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.crew = :crew AND p.postType = :postType ORDER BY p.createdAt DESC")
    Page<Post> findByCrewAndPostType(Crew crew, PostType postType, Pageable pageable);

    // 1. isPublic이 true인 글 (isPublic은 tinyInt형임) or
    // 2. 크루가 태그되었다면 해당 크루에 targetMember와 Member가 속해있는 글들 (tagetMember와 Member가 같은 크루에 있을 때만)
    @Query("SELECT p FROM Post p " +
            "WHERE ((p.isPublic = true) AND p.postType ='STANDARD' AND p.crew IS NULL)" +
            "OR (p.crew IS NOT NULL AND " +
            "     EXISTS (SELECT mc FROM MemberCrew mc WHERE mc.crew = p.crew AND mc.member = :targetMember) AND " +
            "     EXISTS (SELECT mc FROM MemberCrew mc WHERE mc.crew = p.crew AND mc.member = :member)) " +
            "ORDER BY p.createdAt DESC")
    Page<Post> findByMemberAndTargetMember(Member member, Member targetMember, Pageable pageable);

    // 타입이 스탠다드고 작성자가 본인인 글
    @Query("SELECT p FROM Post p WHERE p.postType = 'STANDARD' AND p.author = :member ORDER BY p.createdAt DESC")
    Page<Post> findByMember(Member member, Pageable pageable);

    // 크루
    Page<Post> findByCrewAndPostTypeOrderByIdDesc(Crew crew, PostType postType, Pageable pageable);

    // 멤버
    Page<Post> findByAuthorAndPostTypeOrderByIdDesc(Member author, PostType postType, Pageable pageable);

    // 크루 탈퇴 시 크루 태그된 게시글에서 태그 제거
    @Modifying
    @Query("UPDATE Post p SET p.crew = NULL WHERE p.postType = 'STANDARD' AND p.author = :author AND p.crew = :crew")
    void updateCrewIdToNull(Member author, Crew crew);

}
