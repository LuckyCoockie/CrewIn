package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Crew;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CrewRepository extends JpaRepository<Crew, Long> {

    @Query("SELECT c from Crew c JOIN FETCH c.captain")
    Page<Crew> findAllByCrew(Pageable pageable);

    // 인원 수 가져오기
    @Query("SELECT COUNT(mc) FROM MemberCrew mc WHERE mc.crew.id = :crewId")
    int countMembersByCrewId(Long crewId);

    @Query("SELECT c FROM Crew c JOIN FETCH c.captain JOIN MemberCrew mc ON c.id = mc.crew.id WHERE mc.member.id = :memberId")
    Page<Crew> findCrewsByMemberId(Long memberId, Pageable pageable);

}
