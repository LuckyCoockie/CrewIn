package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.Session;
import com.luckycookie.crewin.domain.enums.SessionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    @Query("SELECT s FROM Session s WHERE s.sessionType = :sessionType AND s.startAt > CURRENT_TIMESTAMP")
    List<Session> findUpcomingSessionsByType(SessionType sessionType);

    @Query("SELECT s FROM Session s WHERE s.crew.crewName LIKE %:crewName%")
    List<Session> findSessionsByCrewNameContaining(String crewName);

    // 내가 만든 세션 조회
    @Query("SELECT s FROM Session s WHERE s.host = :member")
    Page<Session> findAllByHost(Pageable pageable, Member member);
}