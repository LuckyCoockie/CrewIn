package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.MemberSession;
import com.luckycookie.crewin.domain.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MemberSessionRepository extends JpaRepository<MemberSession, Long> {

    // 내가 참가한 세션 조회
    @Query("SELECT ms.session FROM MemberSession ms WHERE ms.member = :member and ms.isAttend = true")
    Page<Session> findByMember(Pageable pageable, Member member);

}
