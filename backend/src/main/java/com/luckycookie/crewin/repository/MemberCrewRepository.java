package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.MemberCrew;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberCrewRepository extends JpaRepository<MemberCrew, Long> {
    boolean existsByMemberAndIsJoinedTrue(Member member);
}
