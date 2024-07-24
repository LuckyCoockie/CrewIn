package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.*;
import com.luckycookie.crewin.domain.enums.SessionType;
import com.luckycookie.crewin.dto.SessionDetailResponse;
import com.luckycookie.crewin.dto.SessionRequest;
import com.luckycookie.crewin.dto.SessionResponse;
import com.luckycookie.crewin.exception.course.NotFoundCourseException;
import com.luckycookie.crewin.exception.crew.CrewMemberNotExsistException;
import com.luckycookie.crewin.exception.crew.NotFoundCrewException;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.exception.session.NotFoundSessionException;
import com.luckycookie.crewin.repository.*;
import com.luckycookie.crewin.security.dto.CustomUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SessionService {

    private final MemberRepository memberRepository;
    private final CrewRepository crewRepository;
    private final MemberCrewRepository memberCrewRepository;
    private final CourseRepository courseRepository;
    private final SessionRepository sessionRepository;
    private final SessionPosterRepository sessionPosterRepository;

    public void createSession(SessionRequest.CreateSessionRequest createSessionRequest, CustomUser customUser) {

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Crew crew = crewRepository.findById(createSessionRequest.getCrewId()).orElseThrow(() -> new NotFoundCrewException(createSessionRequest.getCrewId()));
        Course course = courseRepository.findById(createSessionRequest.getCourseId())
                .orElseThrow(NotFoundCourseException::new);

        Session session = Session
                .builder()
                .sessionType(createSessionRequest.getSessionType())
                .host(member)
                .crew(crew)
                .course(course)
                .name(createSessionRequest.getName())
                .pace(createSessionRequest.getPace())
                .spot(createSessionRequest.getSpot())
                .startAt(createSessionRequest.getStartAt())
                .endAt(createSessionRequest.getEndAt())
                .content(createSessionRequest.getContent())
                .maxPeople(createSessionRequest.getMaxPeople())
                .build();

        sessionRepository.save(session);

        // 세션 포스터 이미지
        if(createSessionRequest.getImages()!=null) {
            for (String imageUrl : createSessionRequest.getImages()) {
                SessionPoster sessionPoster = SessionPoster.builder()
                        .session(session)
                        .imageUrl(imageUrl)
                        .build();
                sessionPosterRepository.save(sessionPoster);
            }
        }
    }

    public List<SessionResponse> getSessionsByType(SessionType sessionType) {
        List<Session> sessions = sessionRepository.findUpcomingSessionsByType(sessionType);
        return sessions.stream().map(this::convertToSessionResponse).collect(Collectors.toList());

    }

    public List<SessionResponse> getSessionsByCrewName(String crewName) {
        List<Session> sessions = sessionRepository.findSessionsByCrewNameContaining(crewName);
        return sessions.stream().map(this::convertToSessionResponse).collect(Collectors.toList());

    }

    public SessionDetailResponse getSessionDetail(Long sessionId, CustomUser customUser) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(NotFoundSessionException::new);
        if (session.getSessionType().equals(SessionType.STANDARD)) {
            Member member = memberRepository.findByEmail(customUser.getEmail())
                    .orElseThrow(NotFoundMemberException::new);
            //여기에 멤버가 해당 크루에 가입되어 있는지 검증하는 코드 추가
            if (!memberCrewRepository.findIsJoinedByMemberIdAndCrewId(member.getId(), session.getCrew().getId())
                    .orElse(false)) {
                throw new CrewMemberNotExsistException();
            }
        }
        Member host = memberRepository.findById(session.getHost().getId())
                .orElseThrow(NotFoundMemberException::new);

        List<SessionPoster> sessionPosters = sessionPosterRepository.findBySessionId(sessionId);


        List<String> imageUrls = sessionPosters.stream()
                .map(SessionPoster::getImageUrl)
                .collect(Collectors.toList());

        return SessionDetailResponse.builder()
                .sessionId(session.getId())
                .courseId(session.getCourse().getId())
                .hostId(host.getId())
                .hostname(host.getName())
                .hostNickname(host.getNickname())
                .crewName(session.getCrew().getCrewName())
                .sessionName(session.getName())
                .spot(session.getSpot())
                .content(session.getContent())
                .maxPeople(session.getMaxPeople())
                .pace(session.getPace())
                .startAt(session.getStartAt())
                .endAt(session.getEndAt())
                .sessionType(session.getSessionType())
                .sessionPosters(imageUrls)
                .build();
    }

    private SessionResponse convertToSessionResponse(Session session) {
        List<SessionPoster> sessionPosters = sessionPosterRepository.findBySessionIdOrderByImageUrlAsc(session.getId());
        String sessionThumbnail = sessionPosters.isEmpty() ? null : sessionPosters.get(0).getImageUrl();

        return SessionResponse.builder()
                .sessionId(session.getId())
                .sessionThumbnail(sessionThumbnail)
                .crewName(session.getCrew().getCrewName())
                .sessionName(session.getName())
                .spot(session.getSpot())
                .sessionType(session.getSessionType())
                .maxPeople(session.getMaxPeople())
                .startAt(session.getStartAt())
                .build();
    }
}
