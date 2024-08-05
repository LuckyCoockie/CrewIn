package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.MemberSession;
import com.luckycookie.crewin.domain.Session;
import com.luckycookie.crewin.domain.enums.SessionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface MemberSessionRepository extends JpaRepository<MemberSession, Long> {

    // 내가 참가한 세션 조회
    @Query("SELECT ms.session FROM MemberSession ms WHERE ms.member = :member and ms.isAttend = true and ms.session.sessionType = :sessionType")
    Page<Session> findByMemberAndIsAttendAndSessionType(Pageable pageable, Member member, SessionType sessionType);

    @Query("SELECT ms.session FROM MemberSession ms WHERE ms.member = :member and ms.isAttend = true")
    Page<Session> findByMember(Pageable pageable, Member member);

    // 특정 member와 session에 해당하는 MemberSession 조회
    @Query("SELECT ms FROM MemberSession ms WHERE ms.member = :member AND ms.session = :session")
    Optional<MemberSession> findByMemberAndSession(Member member, Session session);

    boolean existsByMemberAndSession(Member member, Session session);
}
