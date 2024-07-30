package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Session;
import com.luckycookie.crewin.domain.SessionPoster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionPosterRepository extends JpaRepository<SessionPoster, Long> {
    List<SessionPoster> findBySession(Session session);

    List<SessionPoster> findBySessionOrderByImageUrlAsc(Session session); // 새로 추가된 메소드
}
