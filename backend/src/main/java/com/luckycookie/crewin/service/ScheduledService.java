package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.MemberCrew;
import com.luckycookie.crewin.domain.MemberSession;
import com.luckycookie.crewin.domain.Session;
import com.luckycookie.crewin.domain.enums.SessionType;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.exception.memberSession.NotFoundMemberSessionException;
import com.luckycookie.crewin.repository.MemberCrewRepository;
import com.luckycookie.crewin.repository.MemberRepository;
import com.luckycookie.crewin.repository.MemberSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.luckycookie.crewin.domain.enums.SessionType.THUNDER;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ScheduledService {

    private final MemberRepository memberRepository;
    private final MemberSessionRepository memberSessionRepository;
    private final MemberCrewRepository memberCrewRepository;

    // 세션 종료 시간에 출석 최종 반영
    @Transactional
    @Async
    public void closeAttendance(Session session) {
        log.info("Session{}: attendance check start", session.getId());

        try {
            // 멤버 세션 테이블에서 모두 가져와서 한명씩 출석 반영 수행
            List<MemberSession> attendanceList = memberSessionRepository.findBySession(session);

            for (MemberSession memberSession : attendanceList) {
                if (!memberSession.getIsAttend())
                    continue;

                // 만약 오픈런이면 멤버크루에 없으면 올려주기(false, false)
                if (session.getSessionType() == SessionType.OPEN && !memberCrewRepository.existsByMemberAndCrew(memberSession.getMember(), session.getCrew())) {
                    memberCrewRepository.save(MemberCrew.builder().member(memberSession.getMember()).crew(session.getCrew()).build());
                }

                // 회원테이블에 참여횟수, 누적거리, 누적시간 반영
                Member member = memberRepository.findById(memberSession.getMember().getId()).orElseThrow(NotFoundMemberException::new);
                member.updateRunRecord(session);

                // 정규런, 오픈런인 경우 멤버크루에 참가 횟수 반영
                if (session.getSessionType() != THUNDER) {
                    MemberCrew memberCrew = memberCrewRepository.findByMemberAndCrew(member, session.getCrew()).orElseThrow(NotFoundMemberSessionException::new);
                    memberCrew.plusAttendance();
                }
            }
        } catch (Exception e) {
            log.error("Scheduled Error!!! {}", e.getMessage());
        }
    }
}

