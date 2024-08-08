package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.Session;
import com.luckycookie.crewin.domain.SessionPoster;
import com.luckycookie.crewin.domain.enums.SessionType;
import com.luckycookie.crewin.dto.MyPageRequest.UpdateProfileRequest;
import com.luckycookie.crewin.dto.MyPageRequest.MyPageNicknameRequest;
import com.luckycookie.crewin.dto.MyPageResponse.MyPageSessionItem;
import com.luckycookie.crewin.dto.base.PagingItemsResponse;
import com.luckycookie.crewin.exception.member.DuplicateNicknameException;
import com.luckycookie.crewin.exception.member.MemberNotFoundException;
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
import java.util.Optional;
import java.util.stream.Collectors;

import static com.luckycookie.crewin.domain.enums.SessionType.THUNDER;

@Service
@Transactional
@RequiredArgsConstructor
public class MyPageService {

    private final MemberRepository memberRepository;
    private final SessionRepository sessionRepository;
    private final MemberSessionRepository memberSessionRepository;

    private final S3Service s3Service;

    // 내가 만든, 참가한 세션 조회 (전체)
    @Transactional(readOnly = true)
    public PagingItemsResponse<MyPageSessionItem> getCreatedMySession(CustomUser customUser, int pageNo, String type, String sessionType) {
        // 현재 로그인한 사용자 조회
        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        Pageable pageable = PageRequest.of(pageNo, 10); // pageNo 페이지 번호, 10 : 페이지 크기

        Page<Session> sessionPage = null;
        List<Session> sessions;
        int lastPageNo = 0;

        List<MyPageSessionItem> myPageSessionItems = new ArrayList<>();

        if (sessionType == null) { // null 이면
            sessionType = "ALL"; // 전체
        }

        // sessionType 에 따라서 분리 (STANDARD, OPEN, THUNDER, ALL)
        if (type.equals("created")) { // 내가 만든 세션
            // session 에서 hostId가 member.getId 랑 같으면 내가 만든 세션
            sessionPage = switch (sessionType) {
                case "OPEN" -> sessionRepository.findByHostAndSessionType(pageable, member, SessionType.OPEN);
                case "STANDARD" -> sessionRepository.findByHostAndSessionType(pageable, member, SessionType.STANDARD);
                case "THUNDER" -> sessionRepository.findByHostAndSessionType(pageable, member, THUNDER);
                default -> sessionRepository.findAllByHost(pageable, member);
            };
        } else if (type.equals("joined")) {
            // 내가 참가한 세션
            sessionPage = switch (sessionType) {
                case "OPEN" ->
                        memberSessionRepository.findByMemberAndIsAttendAndSessionType(pageable, member, SessionType.OPEN);
                case "STANDARD" ->
                        memberSessionRepository.findByMemberAndIsAttendAndSessionType(pageable, member, SessionType.STANDARD);
                case "THUNDER" ->
                        memberSessionRepository.findByMemberAndIsAttendAndSessionType(pageable, member, THUNDER);
                default -> memberSessionRepository.findByMember(pageable, member);
            };
        }

        if (sessionPage != null) {
            sessions = sessionPage.getContent();
            lastPageNo = Math.max(sessionPage.getTotalPages() - 1, 0);

            myPageSessionItems = sessions.stream().map(session -> {
                String crewName = session.getSessionType() != THUNDER ? session.getCrew().getCrewName() : null;
                        return MyPageSessionItem
                                .builder()
                                .sessionId(session.getId())
                                .sessionName(session.getName())
                                .startAt(session.getStartAt())
                                .endAt(session.getEndAt())
                                .area(session.getArea())
                                .crewName(crewName)
                                .imageUrl(session.getPosterImages().stream().map(SessionPoster::getImageUrl).toList().get(0))
                                .build();
                    }
            ).collect((Collectors.toList()));
        }

        return PagingItemsResponse
                .<MyPageSessionItem>builder()
                .items(myPageSessionItems)
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .build();

    }

    public void updateProfileImage(CustomUser customUser, UpdateProfileRequest updateProfileRequest) {
        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        if (!member.getImageUrl().equals(updateProfileRequest.getProfileImageUrl())) {
            s3Service.deleteImage(member.getImageUrl()); // 기존 이미지 삭제
        }

        member.updateProfileImage(updateProfileRequest.getProfileImageUrl());
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
