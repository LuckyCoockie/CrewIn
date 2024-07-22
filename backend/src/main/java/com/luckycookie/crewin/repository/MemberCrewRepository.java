package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.MemberCrew;
import com.luckycookie.crewin.domain.enums.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MemberCrewRepository extends JpaRepository<MemberCrew, Long> {
    boolean existsByMemberAndIsJoinedTrue(Member member);

    // 해당 Member 의 Position 반환
    @Query("SELECT mc.position FROM MemberCrew mc WHERE mc.member = :member")
    Optional<Position> findPositionByMember(@Param("member") Member member);
}
