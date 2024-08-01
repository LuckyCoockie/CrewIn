package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.dto.MyPageResponse.MyProfileResponse;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.repository.MemberRepository;
import com.luckycookie.crewin.security.dto.CustomUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MyPageService {

    private final MemberRepository memberRepository;

    public MyProfileResponse getMyProfile(CustomUser customUser) {
        // 현재 로그인한 사용자 조회
        Member member = memberRepository.findByEmail(customUser.getEmail()).orElseThrow(NotFoundMemberException::new);

        return MyProfileResponse
                .builder()
                .totalAttendance(member.getTotalAttendance())
                .totalDistance(member.getTotalDistance())
                .totalTime(member.getTotalTime())
                .imageUrl(member.getImageUrl())
                .nickname(member.getNickname())
                .build();
    }

}
