package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.SessionPoster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionPosterRepository extends JpaRepository<SessionPoster, Long> {



}
