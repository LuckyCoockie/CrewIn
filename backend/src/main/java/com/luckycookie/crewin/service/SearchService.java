package com.luckycookie.crewin.service;



import com.luckycookie.crewin.domain.Crew;
import com.luckycookie.crewin.dto.CrewResponse;
import com.luckycookie.crewin.dto.CrewResponse.CrewItemResponse;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.repository.CrewRepository;
import com.luckycookie.crewin.repository.MemberRepository;
import com.luckycookie.crewin.security.dto.CustomUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@Transactional
@RequiredArgsConstructor
public class SearchService {

    private final MemberRepository memberRepository;
    private final CrewRepository crewRepository;

    @Transactional(readOnly = true)
    public CrewItemResponse searchCrew(String query, int pageNo, CustomUser customUser){
        // CustomUser 검증
        memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        Pageable pageable = PageRequest.of(pageNo, 10); // pageNo 페이지 번호, 10 : 페이지 크기

        Page<Crew> crewsPage;
        List<Crew> crews;
        int lastPageNo;

        crewsPage = crewRepository.findAllByCrewName(query, pageable);

        crews = crewsPage.getContent();
        lastPageNo = Math.max(crewsPage.getTotalPages() - 1, 0);

        List<CrewResponse.CrewItem> crewItems = crews.stream().map(crew -> {
            int crewCount = crewRepository.countMembersByCrew(crew);
            String captainName = crew.getCaptain().getName();

            return CrewResponse.CrewItem.builder()
                    .crewId(crew.getId())
                    .crewName(crew.getCrewName())
                    .slogan(crew.getSlogan())
                    .area(crew.getArea())
                    .crewCount(crewCount)
                    .captainName(captainName)
                    .imageUrl(crew.getMainLogo())
                    .build();
        }).collect(Collectors.toList());

        return CrewItemResponse.builder()
                .crews(crewItems)
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .build();
    }

}
