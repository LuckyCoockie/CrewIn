package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Crew;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CrewRepository extends JpaRepository<Crew, Long> {
    
}
