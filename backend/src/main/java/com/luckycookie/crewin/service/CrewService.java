package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Crew;
import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.dto.CrewRequest;
import com.luckycookie.crewin.dto.CrewResponse.CrewItem;
import com.luckycookie.crewin.dto.CrewResponse.CrewItemResponse;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.repository.CrewRepository;
import com.luckycookie.crewin.repository.MemberRepository;
import com.luckycookie.crewin.security.dto.CustomUser;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${image.prefix}")
    private String prefix;

    @Value("${image.folder}")
    private String folder;

    public void createCrew(CrewRequest.CreateCrewRequest createCrewRequest, CustomUser customUser) {

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        // 기본 이미지 경로 설정
        String defaultMainLogo = prefix + folder + "mainLogo.png";
        String defaultSubLogo = prefix + folder + "crewinLogo.png";
        String defaultBanner = prefix + folder + "banner.png";

        // 요청에서 받은 값이 null인 경우 기본 이미지 경로로 설정
        String mainLogo = createCrewRequest.getMainLogo() != null ? createCrewRequest.getMainLogo() : defaultMainLogo;
        String subLogo = createCrewRequest.getSubLogo() != null ? createCrewRequest.getSubLogo() : defaultSubLogo;
        String banner = createCrewRequest.getBanner() != null ? createCrewRequest.getBanner() : defaultBanner;

        Crew crew = Crew
                .builder()
                .captain(member)
                .crewName(createCrewRequest.getName())
                .slogan(createCrewRequest.getSlogan())
                .introduction(createCrewRequest.getIntroduction())
                .area(createCrewRequest.getArea())
                .mainLogo(mainLogo)
                .subLogo(subLogo)
                .banner(banner)
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
