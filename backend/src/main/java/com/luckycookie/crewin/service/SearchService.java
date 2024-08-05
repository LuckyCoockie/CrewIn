package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Crew;
import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.MemberCrew;
import com.luckycookie.crewin.dto.CrewResponse.CrewItem;
import com.luckycookie.crewin.dto.MemberResponse.MemberItem;
import com.luckycookie.crewin.dto.SearchResponse;
import com.luckycookie.crewin.dto.SearchResponse.MemberInvitationResponse;
import com.luckycookie.crewin.dto.base.PagingItemsResponse;
import com.luckycookie.crewin.exception.crew.NotFoundCrewException;
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
    public PagingItemsResponse<MemberItem> searchMember(String query, int pageNo, CustomUser customUser) {
        //CustomUser 검증
        memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        Pageable pageable = PageRequest.of(pageNo, 10); // pageNo 페이지 번호, 10 : 페이지 크기

        Page<Member> membersPage;
        List<Member> members;
        int lastPageNo;

        membersPage = memberRepository.findAllByName(query, pageable);

        members = membersPage.getContent();
        lastPageNo = Math.max(membersPage.getTotalPages() - 1, 0);

        List<MemberItem> memberItems = members.stream().map(member ->
                MemberItem.builder()
                        .memberId(member.getId())
                        .memberName(member.getName())
                        .memberNickName(member.getNickname())
                        .profileUrl(member.getImageUrl())
                        .build()
        ).collect(Collectors.toList());

        return PagingItemsResponse.<MemberItem>builder()
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .items(memberItems)
                .build();
    }

    @Transactional(readOnly = true)
    public PagingItemsResponse<CrewItem> searchCrew(String query, int pageNo, CustomUser customUser) {
        // CustomUser 검증
        memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        Pageable pageable = PageRequest.of(pageNo, 10); // pageNo 페이지 번호, 10 : 페이지 크기

        Page<Crew> crewsPage;
        List<Crew> crews;
        int lastPageNo;

        if (query.isBlank()) {
            crewsPage = crewRepository.findAllByCrew(pageable);
        } else {
            crewsPage = crewRepository.findAllByCrewName(query, pageable);
        }

        crews = crewsPage.getContent();
        lastPageNo = Math.max(crewsPage.getTotalPages() - 1, 0);

        List<CrewItem> crewItems = crews.stream().map(crew -> {
            int crewCount = crewRepository.countMembersByCrew(crew);
            String captainName = crew.getCaptain().getName();

            return CrewItem.builder()
                    .crewId(crew.getId())
                    .crewName(crew.getCrewName())
                    .slogan(crew.getSlogan())
                    .area(crew.getArea())
                    .crewCount(crewCount)
                    .captainName(captainName)
                    .imageUrl(crew.getMainLogo())
                    .build();
        }).collect(Collectors.toList());

        return PagingItemsResponse.<CrewItem>builder()
                .items(crewItems)
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .build();
    }

    public PagingItemsResponse<MemberInvitationResponse> getMemberForCrewInvitation(Long crewId, String query, CustomUser customUser, int page) {
        memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new); //요청
        crewRepository.findById(crewId)
                .orElseThrow(NotFoundCrewException::new);
        Pageable pageable = PageRequest.of(page, 10);// 토큰 검증
        Page<Object[]> resultPage;
        if (query.isBlank()) {
            resultPage = memberRepository.findMembersForCrewInvitation(crewId, pageable);
        } else {
            resultPage = memberRepository.findMembersForCrewInvitationByQuery(crewId, query, pageable);
        }


        List<MemberInvitationResponse> memberResponses = resultPage.getContent().stream()
                .map(result -> {
                    Member member = (Member) result[0];
                    MemberCrew memberCrew = (MemberCrew) result[1];

                    return SearchResponse.MemberInvitationResponse.builder()
                            .memberId(member.getId())
                            .name(member.getName())
                            .nickname(member.getNickname())
                            .imageUrl(member.getImageUrl())
                            .attendanceCount(memberCrew != null ? memberCrew.getAttendanceCount() : null)
                            .isJoined(memberCrew != null ? memberCrew.getIsJoined() : null)
                            .isInvited(memberCrew != null ? memberCrew.getIsInvited() : null)
                            .build();
                }).collect(Collectors.toList());

        return PagingItemsResponse.<MemberInvitationResponse>builder()
                .items(memberResponses)
                .pageNo(resultPage.getNumber())
                .lastPageNo(resultPage.getTotalPages() - 1)
                .build();

    }
}
