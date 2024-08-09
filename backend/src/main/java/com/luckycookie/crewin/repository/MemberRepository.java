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

    @Query(value = "SELECT m.id, m.name, m.nickname, m.image_url, " +
            "CASE WHEN mc.member_id IS NOT NULL THEN mc.attendance_count ELSE 0 END AS attendance_count " +
            "FROM member m " +
            "LEFT JOIN MemberCrew mc ON m.id = mc.member_id AND mc.crew_id = :crewId " +
            "WHERE (m.name LIKE %:query% OR m.nickname LIKE %:query%) " +
            "AND (mc.member_id IS NULL OR mc.is_invited = false) " +
            "ORDER BY LENGTH(m.name), LENGTH(m.nickname), m.name, m.nickname",
            countQuery = "SELECT COUNT(*) FROM member m " +
                    "LEFT JOIN MemberCrew mc ON m.id = mc.member_id AND mc.crew_id = :crewId " +
                    "WHERE (m.name LIKE %:query% OR m.nickname LIKE %:query%) " +
                    "AND (mc.member_id IS NULL OR mc.is_invited = false)",
            nativeQuery = true)
    Page<Object[]> findMembersForCrewInvitationByQuery(@Param("crewId") Long crewId, @Param("query") String query, Pageable pageable);
}
