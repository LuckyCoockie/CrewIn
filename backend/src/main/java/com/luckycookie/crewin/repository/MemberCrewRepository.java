package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Crew;
import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.MemberCrew;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberCrewRepository extends JpaRepository<MemberCrew, Long> {
    boolean existsByMemberAndIsJoinedTrue(Member member);
}
