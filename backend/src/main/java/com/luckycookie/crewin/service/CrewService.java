package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Crew;
import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.dto.CrewRequest;
import com.luckycookie.crewin.dto.CrewResponse.CrewItem;
import com.luckycookie.crewin.dto.CrewResponse.CrewItemResponse;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.repository.CrewRepository;
import com.luckycookie.crewin.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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
                .crewName(createCrewRequest.getName())
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

    @Transactional(readOnly = true)
    public CrewItemResponse getCrewItem(int pageNo) {
        Pageable pageable = PageRequest.of(pageNo, 10); // pageNo 페이지 번호, 10 : 페이지 크기

        Page<Crew> crewsPage;
        List<Crew> crews;
        int lastPageNo;

        crewsPage = crewRepository.findAllByCrew(pageable);
        crews = crewsPage.getContent();
        lastPageNo = Math.max(crewsPage.getTotalPages() - 1, 0);

        List<CrewItem> crewItems = crews.stream().map(crew -> {
            int crewCount = crewRepository.countMembersByCrewId(crew.getId());
            String captainName = crew.getCaptain().getName();
            return new CrewItem(
                    crew.getId(),
                    crew.getCrewName(),
                    crew.getSlogan(),
                    crew.getArea(),
                    crewCount,
                    captainName,
                    crew.getMainLogo()
            );
        }).collect(Collectors.toList());

        return CrewItemResponse.builder()
                .crews(crewItems)
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .build();
    }

}
