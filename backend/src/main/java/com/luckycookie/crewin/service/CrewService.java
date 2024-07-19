package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Crew;
import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.dto.CrewRequest;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.repository.CrewRepository;
import com.luckycookie.crewin.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CrewService {

    private final CrewRepository crewRepository;
    private final MemberRepository memberRepository;

    public void createCrew(CrewRequest.CreateCrewRequest createCrewRequest) {

        // 작성자 ID (로그인 토큰 발급 이후 토큰으로 변경 해야 함)
        Member member = memberRepository.findById(createCrewRequest.getCaptainId())
                .orElseThrow(NotFoundMemberException::new);

        Crew crew = Crew
                .builder()
                .captain(member)
                .name(createCrewRequest.getName())
                .slogan(createCrewRequest.getSlogan())
                .introduction(createCrewRequest.getIntroduction())
                .area(createCrewRequest.getArea())
                .mainLogo(createCrewRequest.getMainLogo())
                .subLogo(createCrewRequest.getSubLogo())
                .banner(createCrewRequest.getBanner())
                .crewBirth(createCrewRequest.getCrewBirth())
                .build();

        crewRepository.save(crew);

    }

}
