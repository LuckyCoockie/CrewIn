package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Crew;
import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.Post;
import com.luckycookie.crewin.domain.enums.PostType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p from Post p JOIN FETCH p.author WHERE (p.isPublic = true) OR (p.crew.id IN :crews) ORDER BY p.createdAt DESC, p.id DESC")
    Page<Post> findPublicPostsSortedByCreatedAt(List<Long> crews, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.crew = :crew AND p.postType = :postType ORDER BY p.createdAt DESC")
    Page<Post> findByCrewAndPostType(Crew crew, PostType postType, Pageable pageable);

    // 1. isPublic이 true인 글 (isPublic은 tinyInt형임) or
    // 2. 남(targetMember)가 작성한 게시글 중 크루가 태그되지 않은 글 or
    // 3. 크루가 태그되었다면 해당 크루에 targetMember와 Member가 속해있는 글들 (tagetMember와 Member가 같은 크루에 있을 때만)
    @Query("SELECT p FROM Post p " +
            "WHERE (p.isPublic = true) " +
            "OR (p.author = :targetMember AND p.crew IS NULL) " +
            "OR (p.crew IS NOT NULL AND " +
            "     EXISTS (SELECT mc FROM MemberCrew mc WHERE mc.crew = p.crew AND mc.member = :targetMember) AND " +
            "     EXISTS (SELECT mc FROM MemberCrew mc WHERE mc.crew = p.crew AND mc.member = :member)) " +
            "ORDER BY p.createdAt DESC")
    Page<Post> findByMemberAndTargetMember(Member member, Member targetMember, Pageable pageable);

    // 타입이 스탠다드고 작성자가 본인인 글
    @Query("SELECT p FROM Post p where p.postType = 'STANDARD' AND p.author = :member")
    Page<Post> findByMember(Member member, Pageable pageable);

    // 크루
    // PostId가 기준보다 큰 포스트들을 오름차순으로 가져오는 메서드
    Page<Post> findByCrewAndIdGreaterThanAndPostTypeOrderByIdAsc(Crew crew, Long id, PostType postType, Pageable pageable);

    // PostId가 기준보다 작은 포스트들을 내림차순으로 가져오는 메서드
    Page<Post> findByCrewAndIdLessThanAndPostTypeOrderByIdAsc(Crew crew, Long id, PostType postType, Pageable pageable);

    // 멤버
    // PostId가 기준보다 큰 포스트들
    Page<Post> findByAuthorAndIdGreaterThanAndPostTypeOrderByIdAsc(Member author, Long id, PostType postType, Pageable pageable);

    // PostId가 기준보다 작은 포스트들
    Page<Post> findByAuthorAndIdLessThanAndPostTypeOrderByIdAsc(Member author, Long id, PostType postType, Pageable pageable);

}
