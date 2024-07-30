package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Crew;
import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.MemberCrew;
import com.luckycookie.crewin.domain.enums.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberCrewRepository extends JpaRepository<MemberCrew, Long> {

    @Query(value = "SELECT mc.isJoined FROM MemberCrew mc WHERE mc.id = :memberId AND mc.crew.id = :crewId")
    Optional<Boolean> findIsJoinedByMemberIdAndCrewId(@Param("memberId") Long memberId, @Param("crewId") Long crewId);

    List<Boolean> existsByMemberAndIsJoinedTrue(Member member);

    @Query("SELECT mc.position FROM MemberCrew mc WHERE mc.member = :member and mc.crew.id = :crewId")
    Optional<Position> findPositionByMember(@Param("member") Member member, @Param("crewId") Long crewId);

    @Modifying
    @Query("DELETE FROM MemberCrew mc WHERE mc.crew.id = :crewId")
    void deleteByCrewId(@Param("crewId") Long crewId);

    @Modifying
    @Query("UPDATE MemberCrew mc SET mc.position = :position WHERE mc.id = :memberCrewId")
    void updatePosition(@Param("memberCrewId") Long memberCrewId, @Param("position") Position position);

    Optional<MemberCrew> findByMemberIdAndCrewId(Long memberId, Long crewId);

    boolean existsByMemberAndCrew(Member member, Crew crew);

    // 해당 크루에 있는 크루원 조회
    List<MemberCrew> findByCrewId(Long crewId);

    List<MemberCrew> findMemberCrewsByMemberId(Long memberId);

    @Query("SELECT mc FROM MemberCrew mc WHERE mc.member = :member AND mc.isJoined = true")
    List<MemberCrew> findJoinedMemberCrewsByMember(Member member);

    @Query("SELECT mc.crew.id FROM MemberCrew mc WHERE mc.member.id = :memberId")
    List<Long> findJoinedCrewIdsByMemberId(@Param("memberId") Long memberId);

}
