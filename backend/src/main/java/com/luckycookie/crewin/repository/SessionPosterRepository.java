package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.SessionPoster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionPosterRepository extends JpaRepository<SessionPoster, Long> {
    List<SessionPoster> findBySessionId(Long sessionId);

    List<SessionPoster> findBySessionIdOrderByImageUrlAsc(Long sessionId); // 새로 추가된 메소드
}
