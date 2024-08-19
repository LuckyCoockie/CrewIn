package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.MemberSession;
import com.luckycookie.crewin.domain.Session;
import com.luckycookie.crewin.dto.AttendanceRequest.AttendanceInfoRequest;
import com.luckycookie.crewin.dto.AttendanceResponse.AttendanceInfo;
import com.luckycookie.crewin.dto.AttendanceResponse.AttendanceMemberItem;
import com.luckycookie.crewin.dto.AttendanceResponse.AttendanceMemberResponse;
import com.luckycookie.crewin.exception.attendance.InvalidLocationException;
import com.luckycookie.crewin.exception.attendance.InvalidRequestTimeException;
import com.luckycookie.crewin.exception.attendance.UnauthorizedRequestException;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.exception.memberSession.NotFoundMemberSessionException;
import com.luckycookie.crewin.exception.session.InvalidSessionException;
import com.luckycookie.crewin.exception.session.NotFoundSessionException;
import com.luckycookie.crewin.exception.session.SessionAuthorizationException;
import com.luckycookie.crewin.repository.EmitterRepository;
import com.luckycookie.crewin.repository.MemberRepository;
import com.luckycookie.crewin.repository.MemberSessionRepository;
import com.luckycookie.crewin.repository.SessionRepository;
import com.luckycookie.crewin.security.dto.CustomUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import static com.luckycookie.crewin.domain.enums.SessionType.THUNDER;
import static com.luckycookie.crewin.service.AttendanceService.AutoCheckStatus.*;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class AttendanceService {

    private final SessionRepository sessionRepository;
    private final MemberRepository memberRepository;
    private final MemberSessionRepository memberSessionRepository;
    private final ScheduledExecutorService executorService = Executors.newSingleThreadScheduledExecutor();
    private final ScheduledService scheduledService;
    private final EmitterRepository emitterRepository;

    // 자동 출석 시간 인터벌
    private static final int AUTO_CHECK_TIME = 10;

    // SSE 구독
    public SseEmitter subscribeSse(Long sessionId, String email) {
        Session session = sessionRepository.findById(sessionId).orElseThrow(NotFoundSessionException::new);
        Member member = memberRepository.findFirstByEmail(email).orElseThrow(NotFoundMemberException::new);

        // 해당 세션에 존재하지 않는 멤버는 SSE 요청 불가능
        MemberSession memberSession = memberSessionRepository.findByMemberAndSession(member, session).orElseThrow(NotFoundMemberSessionException::new);
        LocalDateTime now = LocalDateTime.now();
        if (session.getAttendanceStart() == null || now.isBefore(session.getAttendanceStart()) || now.isAfter(session.getEndAt()))
            throw new InvalidRequestTimeException();

        SseEmitter emitter = emitterRepository.save(session.getId(), memberSession.getId(), new SseEmitter(60 * 1000L * 60));
        emitter.onCompletion(() -> {
            emitterRepository.deleteById(session.getId(), memberSession.getId());
            log.info("SSE emitter onCompletion");
        });
        emitter.onTimeout(() -> {
            emitter.complete();
            log.info("SSE emitter onTimeout");
        });
        emitter.onError((exception) -> {
            log.error("SSE emitter Error occurred: {}", exception.getMessage(), exception);
        });

        // 503 에러 방지용
        sendNotification(emitter, "connect", "connect", sessionId, memberSession.getId(), "connect complete");

        return emitter;
    }

    private void sendNotification(SseEmitter emitter, String eventId, String eventName, Long sessionId, Long memberSessionId, Object data) {
        try {
            emitter.send(SseEmitter.event()
                    .id(eventId)
                    .name(eventName)
                    .data(data)
            );
        } catch (IOException exception) {
            log.error("SSE Exception occurred!!! : {}", exception.getMessage(), exception);
            emitterRepository.deleteById(sessionId, memberSessionId);
        }
    }

    public void startAttendance(Long sessionId, String email, AttendanceInfoRequest attendanceInfoRequest) {
        // 세션 존재 체크
        Session session = sessionRepository.findById(sessionId).orElseThrow(NotFoundSessionException::new);

        // 요청자가 주최자인지 체크
        Member host = memberRepository.findFirstByEmail(email).orElseThrow(NotFoundMemberException::new);
        if (!session.getHost().getId().equals(host.getId())) {
            throw new SessionAuthorizationException();
        }

        // 이미 시작한 세션은 또 시작 불가능 && 시작 시간이 세션 시작시간 이후인지 체크
        if (session.getAttendanceStart() != null || LocalDateTime.now().isBefore(session.getStartAt())) {
            throw new InvalidSessionException();
        }

        // 주최자 위치 등록, 시작시간 등록
        session.startSession(attendanceInfoRequest);

        // 스케줄러 등록
        long delay = Duration.between(LocalDateTime.now(), session.getEndAt()).toSeconds();
        if (delay < 0) {
            throw new InvalidSessionException();
        }

        executorService.schedule(() -> scheduledService.closeAttendance(session), delay, TimeUnit.SECONDS);
    }

    // 출석부 목록 조회
    public AttendanceMemberResponse getAttendanceMemberList(Long sessionId, CustomUser customUser) {

        Session session = sessionRepository.findById(sessionId).orElseThrow(NotFoundSessionException::new);

        List<MemberSession> memberSessionList = null;
        if (session.getSessionType() != THUNDER)
            memberSessionList = memberSessionRepository.findBySessionSortedByPosition(session);
        else
            memberSessionList = memberSessionRepository.findBySessionWithMember(session);

        // 현재 로그인한 사용자
        Member currentMember = memberRepository.findFirstByEmail(customUser.getEmail()).orElseThrow(NotFoundMemberException::new);

        // 현재 로그인한 사용자가 memberSession 에 있어야 함 - 내가 속하지 않은 크루의 출석부는 조회 불가!!
        MemberSession memberSession = memberSessionRepository.findByMemberAndSession(currentMember, session).orElseThrow(NotFoundMemberSessionException::new);

        List<AttendanceMemberItem> attendanceMemberItems = memberSessionList.stream().map(memberSessionItem -> {
            Member member = memberSessionItem.getMember();

            return AttendanceMemberItem
                    .builder()
                    .memberSessionId(memberSessionItem.getId())
                    .name(member.getName())
                    .isAttend(memberSessionItem.getIsAttend())
                    .profileUrl(member.getImageUrl())
                    .nickname(member.getNickname())
                    .build();
        }).toList();

        AutoCheckStatus status = null;
        LocalDateTime now = LocalDateTime.now();
        if (session.getAttendanceStart() == null || session.getAttendanceStart().isAfter(LocalDateTime.now()) || session.getAttendanceStart().isEqual(LocalDateTime.now())) {
            status = BEFORE;
        } else if (now.isAfter(session.getAttendanceStart()) && now.isBefore(session.getAttendanceStart().plusMinutes(AUTO_CHECK_TIME))) {
            status = DURING;
        } else {
            status = AFTER;
        }

        int leftTime = (status == DURING) ?
                (int) ChronoUnit.SECONDS.between(LocalDateTime.now(), session.getAttendanceStart().plusMinutes(AUTO_CHECK_TIME)) : 0;

        return AttendanceMemberResponse
                .builder()
                .items(attendanceMemberItems)
                .AutoCheckStatus(status.name())
                .leftTime(leftTime)
                .memberSessionId(memberSession.getId())
                .build();
    }

    // 출석체크
    public void attend(Long sessionId, String email, AttendanceInfoRequest attendanceInfoRequest) {
        Member member = memberRepository.findFirstByEmail(email).orElseThrow(NotFoundMemberException::new);
        Session session = sessionRepository.findById(sessionId).orElseThrow(NotFoundSessionException::new);
        MemberSession memberSession = memberSessionRepository.findByMemberAndSession(member, session)
                .orElseThrow(NotFoundMemberSessionException::new);

        // 출석이 시작했는지 체크
        // 출석 시간이 맞는지 체크(출석 시작부터 10분간)
        if (session.getAttendanceStart() == null
                || LocalDateTime.now().isBefore(session.getAttendanceStart())
                || LocalDateTime.now().isAfter(session.getAttendanceStart().plusMinutes(AUTO_CHECK_TIME))
                || LocalDateTime.now().isAfter(session.getEndAt())
                || LocalDateTime.now().isBefore(session.getStartAt())
        ) {
            throw new InvalidRequestTimeException();
        }

        // 호스트 위치가 존재하는지 체크 + 출석 반경에 있는지 체크
        if (session.getHost() == null || isDistanceMoreThan100Meters(session.getLat(), session.getLng(), attendanceInfoRequest.getLat(), attendanceInfoRequest.getLng())) {
            throw new InvalidLocationException();
        }

        // 멤버-세션에 출석여부 반영
        memberSession.changeAttend(true);

        // 세션 회원들에게 SSE 메세지 발송
        List<SseEmitter> emitters = emitterRepository.findEmittersBySessionId(sessionId);
        for (SseEmitter sseEmitter : emitters) {
            sendNotification(sseEmitter, "attendance", "attendance", sessionId, memberSession.getId(), AttendanceInfo.builder().memberSessionId(memberSession.getId()).isAttend(true).build());
        }

    }

    // 두 좌표 간의 거리를 계산하는 메소드
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // 지구의 반지름 (단위: 미터)
        double EARTH_RADIUS = 6371e3;

        double lat1Rad = Math.toRadians(lat1);
        double lat2Rad = Math.toRadians(lat2);
        double deltaLatRad = Math.toRadians(lat2 - lat1);
        double deltaLonRad = Math.toRadians(lon2 - lon1);

        double a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                        Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c; // 두 지점 간의 거리 (단위: 미터)
    }

    // 두 좌표가 100미터 이상 떨어져 있는지 확인하는 메소드
    private boolean isDistanceMoreThan100Meters(double lat1, double lon1, double lat2, double lon2) {
        double distance = calculateDistance(lat1, lon1, lat2, lon2);
        return distance > 100;
    }

    public void updateAttendance(Long memberSessionId, boolean attendValue, String email) {
        MemberSession memberSession = memberSessionRepository.findByIdWithSessionHost(memberSessionId).orElseThrow(NotFoundMemberSessionException::new);
        Member client = memberRepository.findFirstByEmail(email).orElseThrow(NotFoundMemberException::new);

        // 수정 요청자가 호스트인지 체크
        if (!memberSession.getSession().getHost().getId().equals(client.getId())) {
            throw new UnauthorizedRequestException();
        }

        Session session = memberSession.getSession();

        // 수정시간은 자동출석 끝난 뒤부터 세션 종료 시간까지
        if (LocalDateTime.now().isBefore(session.getAttendanceStart().plusMinutes(10)) ||
                LocalDateTime.now().isAfter(session.getEndAt())) {
            throw new InvalidRequestTimeException();
        }

        // 출석 수정
        memberSession.changeAttend(attendValue);

        // 세션 회원들에게 SSE 메세지 발송
        List<SseEmitter> emitters = emitterRepository.findEmittersBySessionId(session.getId());
        for (SseEmitter sseEmitter : emitters) {
            sendNotification(sseEmitter, "attendance", "attendance", session.getId(), memberSession.getId(), AttendanceInfo.builder().memberSessionId(memberSession.getId()).isAttend(attendValue).build());
        }
    }

    enum AutoCheckStatus {
        BEFORE, DURING, AFTER
    }
}
