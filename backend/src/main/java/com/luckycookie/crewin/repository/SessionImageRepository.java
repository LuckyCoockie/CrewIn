package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Session;
import com.luckycookie.crewin.domain.SessionImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionImageRepository extends JpaRepository<SessionImage, Long> {

    Page<SessionImage> findBySessionOrderByIdDesc(Session session, Pageable pageable);

}