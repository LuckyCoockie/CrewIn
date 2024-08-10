package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.Session;
import com.luckycookie.crewin.domain.enums.SessionType;
import jakarta.annotation.Nonnull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    // 내가 만든 세션 조회
    @Query("SELECT s FROM Session s JOIN FETCH s.host JOIN FETCH s.course LEFT JOIN s.crew" +
            " WHERE s.host = :member AND s.sessionType = :sessionType order by s.id desc")
    Page<Session> findByHostAndSessionType(Pageable pageable, Member member, SessionType sessionType);

    @Query("SELECT s FROM Session s JOIN FETCH s.host JOIN FETCH s.course LEFT JOIN s.crew" +
            " WHERE s.host = :member order by s.id desc")
    Page<Session> findAllByHost(Pageable pageable, Member member);

    @Override
    @Nonnull
    @EntityGraph(attributePaths = {"host", "course", "crew"})
    Optional<Session> findById(@Nonnull Long id);

}