package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Session;
import com.luckycookie.crewin.domain.enums.SessionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    @Query("SELECT s FROM Session s WHERE s.sessionType = :sessionType AND s.startAt > CURRENT_TIMESTAMP")
    List<Session> findUpcomingSessionsByType(@Param("sessionType") SessionType sessionType);
}