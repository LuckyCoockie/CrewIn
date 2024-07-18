package com.luckycookie.crewin.repository;

import com.luckycookie.crewin.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String nickname);
}
