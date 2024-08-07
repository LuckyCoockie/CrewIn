package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.MemberSession;
import com.luckycookie.crewin.domain.Session;
import com.luckycookie.crewin.dto.AttendanceRequest;
import com.luckycookie.crewin.dto.AttendanceRequest.StartAttendanceRequest;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.exception.memberSession.NotFoundMemberSessionException;
import com.luckycookie.crewin.exception.session.InvalidSessionException;
import com.luckycookie.crewin.exception.session.NotFoundSessionException;
import com.luckycookie.crewin.exception.session.SessionAuthorizationException;
import com.luckycookie.crewin.repository.MemberRepository;
import com.luckycookie.crewin.repository.MemberSessionRepository;
import com.luckycookie.crewin.repository.SessionRepository;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class AttendanceService {

    private final SessionRepository sessionRepository;
    private final MemberRepository memberRepository;
    private final MemberSessionRepository memberSessionRepository;

    public void startAttendance(Long sessionId, String email, StartAttendanceRequest startAttendanceRequest) {
        // 세션 존재 체크
        Session session = sessionRepository.findById(sessionId).orElseThrow(NotFoundSessionException::new);

        // 요청자가 주최자인지 체크
        Member host = memberRepository.findByEmail(email).orElseThrow(NotFoundMemberException::new);
        if (!session.getHost().getId().equals(host.getId())) {
            throw new SessionAuthorizationException();
        }

        // 이미 시작한 세션은 또 시작 불가능
        //시작 시간이 세션 시작시간 이후인지 체크
        if (session.getAttendanceStart() != null || LocalDateTime.now().isBefore(session.getStartAt())) {
            throw new InvalidSessionException();
        }

        // 주최자 위치 등록, 시작시간 등록, 주최자 출석 true
        session.startSession(startAttendanceRequest);
        MemberSession hostAttendance = memberSessionRepository.findByMemberAndSession(host, session).orElseThrow(NotFoundMemberSessionException::new);
        hostAttendance.changeAttend(true);

        // 스케줄러 등록
        
    }
}
