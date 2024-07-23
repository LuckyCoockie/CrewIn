package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.*;
import com.luckycookie.crewin.domain.enums.SessionType;
import com.luckycookie.crewin.dto.SessionRequest;
import com.luckycookie.crewin.dto.SessionResponse;
import com.luckycookie.crewin.exception.course.NotFoundCourseException;
import com.luckycookie.crewin.exception.crew.NotFoundCrewException;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
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

    private final CourseRepository courseRepository;
    private final SessionRepository sessionRepository;
    private final MemberRepository memberRepository;
    private final CrewRepository crewRepository;
    private final SessionPosterRepository sessionPosterRepository;

    public void createSession(SessionRequest.CreateSessionRequest createSessionRequest, CustomUser customUser) {

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Crew crew = crewRepository.findById(createSessionRequest.getCrewId()).orElseThrow(NotFoundCrewException::new);
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
        return sessions.stream().map(this::convertToDto).collect(Collectors.toList());

    }

    public List<SessionResponse> getSessionsByCrewName(String crewName) {
        List<Session> sessions = sessionRepository.findSessionsByCrewNameContaining(crewName);
        return sessions.stream().map(this::convertToDto).collect(Collectors.toList());

    }

    private SessionResponse convertToDto(Session session) {
        return SessionResponse.builder()
                .hostName(session.getHost().getName())
                .crewName(session.getCrew().getCrewName())
                .courseName(session.getCourse().getName())
                .sessionName(session.getName())
                .spot(session.getSpot())
                .content(session.getContent())
                .sessionType(session.getSessionType())
                .pace(session.getPace())
                .maxPeople(session.getMaxPeople())
                .startAt(session.getStartAt())
                .endAt(session.getEndAt())
                .build();
    }
}
