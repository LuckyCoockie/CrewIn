package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.*;
import com.luckycookie.crewin.dto.MyPageRequest;
import com.luckycookie.crewin.dto.MyPageRequest.MyPageNicknameRequest;
import com.luckycookie.crewin.dto.MyPageResponse.MyPageSessionItem;
import com.luckycookie.crewin.dto.MyPageResponse.MyPageSessionResponse;
import com.luckycookie.crewin.dto.MyPageResponse.MyProfileResponse;
import com.luckycookie.crewin.exception.member.DuplicateNicknameException;
import com.luckycookie.crewin.exception.member.InvalidCredentialException;
import com.luckycookie.crewin.exception.member.MemberNotFoundException;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.repository.MemberRepository;
import com.luckycookie.crewin.repository.MemberSessionRepository;
import com.luckycookie.crewin.repository.SessionRepository;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.sun.jdi.request.DuplicateRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MyPageService {

    private final MemberRepository memberRepository;
    private final SessionRepository sessionRepository;
    private final MemberSessionRepository memberSessionRepository;

    // 내 프로필 조회
    @Transactional(readOnly = true)
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
    @Transactional(readOnly = true)
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

    // 닉네임 변경
    public void changeNickname(CustomUser customUser, MyPageNicknameRequest myPageNicknameRequest) {
        Member member = memberRepository.findByEmail(customUser.getEmail()).orElseThrow(MemberNotFoundException::new);

        // 변경하고자 하는 nickname
        String nickname = myPageNicknameRequest.getNickname();

        // 현재 닉네임이랑 같은지 확인
        if (member.getNickname().equals(nickname)) {
            throw new DuplicateNicknameException();
        }

        // 닉네임 중복 체크
        Optional<Member> existingMember = memberRepository.findByNickname(nickname);
        if (existingMember.isPresent()) {
            throw new DuplicateNicknameException();
        }

        // 닉네임 변경
        member.changeNickname(nickname);
    }

}
