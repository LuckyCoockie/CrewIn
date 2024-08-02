package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    // 멤버 검색하기
    @Query("SELECT m FROM Member m WHERE m.name LIKE %:query% or m.nickname LIKE %:query%")
    Page<Member> findAllByName(@Param("query") String query, Pageable pageable);

    Optional<Member> findByNickname(String nickname);

}
