package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.*;
import com.luckycookie.crewin.dto.SessionRequest;
import com.luckycookie.crewin.exception.course.NotFoundCourseException;
import com.luckycookie.crewin.exception.crew.NotFoundCrewException;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.repository.*;
import com.luckycookie.crewin.security.dto.CustomUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

}
