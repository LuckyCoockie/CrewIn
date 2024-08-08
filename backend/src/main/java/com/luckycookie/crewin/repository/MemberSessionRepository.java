package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.MemberSession;
import com.luckycookie.crewin.domain.Session;
import com.luckycookie.crewin.domain.enums.SessionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MemberSessionRepository extends JpaRepository<MemberSession, Long> {

    // 내가 참가한 세션 조회
    @Query("SELECT ms.session FROM MemberSession ms WHERE ms.member = :member and ms.isAttend = true and ms.session.sessionType = :sessionType order by ms.id desc")
    Page<Session> findByMemberAndIsAttendAndSessionType(Pageable pageable, Member member, SessionType sessionType);

    @Query("SELECT ms.session FROM MemberSession ms WHERE ms.member = :member and ms.isAttend = true order by ms.id desc")
    Page<Session> findByMember(Pageable pageable, Member member);

    // 특정 member와 session에 해당하는 MemberSession 조회
    @Query("SELECT ms FROM MemberSession ms WHERE ms.member = :member AND ms.session = :session")
    Optional<MemberSession> findByMemberAndSession(Member member, Session session);

    @Query("SELECT ms FROM MemberSession ms JOIN ms.member m JOIN MemberCrew mc ON mc.member = m AND mc.crew = ms.session.crew " +
            "WHERE ms.session = :session " +
            "ORDER BY CASE mc.position " +
            "  WHEN com.luckycookie.crewin.domain.enums.Position.CAPTAIN THEN 1 " +
            "  WHEN com.luckycookie.crewin.domain.enums.Position.PACER THEN 2 " +
            "  WHEN com.luckycookie.crewin.domain.enums.Position.MEMBER THEN 3 " +
            "  ELSE 4 " +
            "END")
    List<MemberSession> findBySession(Session session);

    boolean existsByMemberAndSession(Member member, Session session);

    @Query("select ms from MemberSession ms join fetch ms.session s join fetch s.host where ms.id = :id")
    Optional<MemberSession> findByIdWithSessionHost(Long id);
}
