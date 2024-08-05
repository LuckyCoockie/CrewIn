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

    // 크루 초대할 멤버 검색

    @Query("SELECT m, mc FROM Member m " +
            "LEFT JOIN MemberCrew mc ON m.id = mc.member.id AND (mc.crew.id = :crewId OR mc.crew.id IS NULL) " +
            "WHERE mc.isJoined IS NULL OR mc.isJoined = false " +
            "ORDER BY CASE " +
            "    WHEN mc.isInvited IS NULL THEN 0 " +
            "    WHEN mc.isInvited = false THEN 1 " +
            "    WHEN mc.isInvited = true THEN 2 " +
            "END, m.id")
    Page<Object[]> findMembersForCrewInvitation(@Param("crewId") Long crewId, Pageable pageable);

    @Query("SELECT m, mc FROM Member m " +
            "LEFT JOIN MemberCrew mc ON m.id = mc.member.id AND (mc.crew.id = :crewId OR mc.crew.id IS NULL) " +
            "WHERE (mc.isJoined IS NULL OR mc.isJoined = false) " +
            "AND (LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(m.nickname) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "ORDER BY CASE " +
            "    WHEN mc.isInvited IS NULL THEN 0 " +
            "    WHEN mc.isInvited = false THEN 1 " +
            "    WHEN mc.isInvited = true THEN 2 " +
            "END, m.id")
    Page<Object[]> findMembersForCrewInvitationByQuery(@Param("crewId") Long crewId, @Param("query") String query, Pageable pageable);
}
