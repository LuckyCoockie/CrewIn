package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Crew;
import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.MemberCrew;
import com.luckycookie.crewin.domain.enums.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberCrewRepository extends JpaRepository<MemberCrew, Long> {

    @Query(value = "SELECT mc.isJoined FROM MemberCrew mc WHERE mc.member = :member AND mc.crew = :crew")
    Optional<Boolean> findIsJoinedByMemberAndCrew(Member member, Crew crew);

    @Query("SELECT mc.position FROM MemberCrew mc WHERE mc.member = :member and mc.crew = :crew")
    Optional<Position> findPositionByMemberAndCrew(Member member, Crew crew);

    @Modifying
    @Query("DELETE FROM MemberCrew mc WHERE mc.crew = :crew")
    void deleteByCrew(Crew crew);

    Optional<MemberCrew> findByMemberAndCrew(Member member, Crew crew);

    boolean existsByMemberAndCrew(Member member, Crew crew);

    // 해당 크루에 있는 크루원 조회
    List<MemberCrew> findByCrew(Crew crew);

    @Query("SELECT mc FROM MemberCrew mc WHERE mc.member = :member AND mc.isJoined = true")
    List<MemberCrew> findJoinedMemberCrewsByMember(Member member);

    @Query("SELECT mc FROM MemberCrew mc WHERE mc.member = :member and mc.isJoined = true")
    List<MemberCrew> findCrewByMemberAndIsJoined(Member member);

}
