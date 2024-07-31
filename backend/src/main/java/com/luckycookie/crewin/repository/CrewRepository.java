package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Crew;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CrewRepository extends JpaRepository<Crew, Long> {

    @Query("SELECT c from Crew c JOIN FETCH c.captain")
    Page<Crew> findAllByCrew(Pageable pageable);

    // crew_name으로 검색하기
    @Query("SELECT c FROM Crew c WHERE c.crewName LIKE %:query%")
    Page<Crew> findAllByCrewName(@Param("query") String query, Pageable pageable);

    // 인원 수 가져오기
    @Query("SELECT COUNT(mc) FROM MemberCrew mc WHERE mc.crew = :crew")
    int countMembersByCrew(Crew crew);

}
