package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.Session;
import com.luckycookie.crewin.domain.SessionPoster;
import com.luckycookie.crewin.dto.MyPageResponse.MyPageSessionItem;
import com.luckycookie.crewin.dto.MyPageResponse.MyPageSessionResponse;
import com.luckycookie.crewin.dto.MyPageResponse.MyProfileResponse;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.repository.MemberRepository;
import com.luckycookie.crewin.repository.MemberSessionRepository;
import com.luckycookie.crewin.repository.SessionRepository;
import com.luckycookie.crewin.security.dto.CustomUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MyPageService {

    private final MemberRepository memberRepository;
    private final SessionRepository sessionRepository;
    private final MemberSessionRepository memberSessionRepository;

    // 내 프로필 조회
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

    // 내가 만든, 참가한 세션 조회
    public MyPageSessionResponse getCreatedMySession(CustomUser customUser, int pageNo, String type) {
        // 현재 로그인한 사용자 조회
        Member member = memberRepository.findByEmail(customUser.getEmail()).orElseThrow(NotFoundMemberException::new);

        Pageable pageable = PageRequest.of(pageNo, 10); // pageNo 페이지 번호, 10 : 페이지 크기

        Page<Session> sessionPage = null;
        List<Session> sessions;
        int lastPageNo = 0;

        List<MyPageSessionItem> myPageSessionItems = new ArrayList<>();

        if(type.equals("created")) { // 내가 만든 세션
            // session 에서 hostId가 member.getId 랑 같으면 내가 만든 세션
            sessionPage = sessionRepository.findAllByHost(pageable, member);
        } else if(type.equals("joined")) {
            // 내가 참가한 세션
            sessionPage = memberSessionRepository.findByMember(pageable, member);
        }

        if(sessionPage != null) {
            sessions = sessionPage.getContent();
            lastPageNo = Math.max(sessionPage.getTotalPages() - 1, 0);

            myPageSessionItems = sessions.stream().map(session -> MyPageSessionItem
                    .builder()
                    .sessionId(session.getId())
                    .sessionName(session.getName())
                    .startAt(session.getStartAt())
                    .imageUrl(session.getPosterImages().stream().map(SessionPoster::getImageUrl).toList().get(0))
                    .build()).collect((Collectors.toList()));
        }

        return MyPageSessionResponse
                .builder()
                .sessions(myPageSessionItems)
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .build();

    }

}
