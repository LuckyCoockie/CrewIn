package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.*;
import com.luckycookie.crewin.domain.enums.SessionType;
import com.luckycookie.crewin.dto.*;
import com.luckycookie.crewin.dto.SessionImageResponse.SessionGalleryItem;
import com.luckycookie.crewin.dto.SessionImageResponse.SessionGalleryItemsResponse;
import com.luckycookie.crewin.exception.course.NotFoundCourseException;
import com.luckycookie.crewin.exception.crew.CrewMemberNotExistException;
import com.luckycookie.crewin.exception.crew.NotFoundCrewException;
import com.luckycookie.crewin.exception.member.MemberNotFoundException;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.exception.memberSession.NotFoundMemberSessionException;
import com.luckycookie.crewin.exception.session.InvalidSessionException;
import com.luckycookie.crewin.exception.session.NotFoundSessionException;
import com.luckycookie.crewin.exception.session.SessionAuthorizationException;
import com.luckycookie.crewin.exception.session.SessionInProgressException;
import com.luckycookie.crewin.repository.*;
import com.luckycookie.crewin.security.dto.CustomUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SessionService {

    private final MemberRepository memberRepository;
    private final CrewRepository crewRepository;
    private final MemberCrewRepository memberCrewRepository;
    private final CourseRepository courseRepository;
    private final SessionRepository sessionRepository;
    private final SessionPosterRepository sessionPosterRepository;
    private final SessionQueryRepository sessionQueryRepository;
    private final SessionImageRepository sessionImageRepository;
    private final MemberSessionRepository memberSessionRepository;

    public void createSession(SessionRequest.CreateSessionRequest createSessionRequest, CustomUser customUser) {

        if (createSessionRequest.getSessionType() == SessionType.THUNDER && createSessionRequest.getCrewId() != null) {
            throw new InvalidSessionException();
        }
        if (createSessionRequest.getStartAt().isAfter(createSessionRequest.getEndAt()) ||
                createSessionRequest.getStartAt().isBefore(LocalDateTime.now())) {
            throw new InvalidSessionException();
        }

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Crew crew = null;
        if (createSessionRequest.getCrewId() != null) {
            crew = crewRepository.findById(createSessionRequest.getCrewId()).orElseThrow(NotFoundCrewException::new);
        }
        Course course = courseRepository.findById(createSessionRequest.getCourseId())
                .orElseThrow(NotFoundCourseException::new);

        Session session = Session
                .builder()
                .sessionType(createSessionRequest.getSessionType())
                .host(member)
                .crew(crew)
                .area(course.getArea())
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
        if (createSessionRequest.getImages() != null) {
            for (String imageUrl : createSessionRequest.getImages()) {
                SessionPoster sessionPoster = SessionPoster.builder()
                        .session(session)
                        .imageUrl(imageUrl)
                        .build();
                sessionPosterRepository.save(sessionPoster);
            }
        }
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
            if (!memberCrewRepository.findIsJoinedByMemberAndCrew(member, session.getCrew())
                    .orElse(false)) {
                throw new CrewMemberNotExistException();
            }
        }

        Member host = memberRepository.findById(session.getHost().getId())
                .orElseThrow(NotFoundMemberException::new);

        boolean userSessionCompare;
        userSessionCompare = customUser.getEmail().equals(host.getEmail());

        List<SessionPoster> sessionPosters = sessionPosterRepository.findBySession(session);


        List<String> imageUrls = sessionPosters.stream()
                .map(SessionPoster::getImageUrl)
                .collect(Collectors.toList());

        Course course = courseRepository.findById(session.getCourse().getId())
                .orElseThrow(NotFoundCourseException::new);

        return SessionDetailResponse.builder()
                .sessionId(session.getId())
                .courseId(session.getCourse().getId())
                .isSessionHost(userSessionCompare)
                .hostname(host.getName())
                .area(session.getArea())
                .hostNickname(host.getNickname())
                .crewName(session.getCrew().getCrewName())
                .sessionName(session.getName())
                .spot(session.getSpot())
                .content(session.getContent())
                .courseThumbnail(course.getThumbnailImage())
                .maxPeople(session.getMaxPeople())
                .pace(session.getPace())
                .startAt(session.getStartAt())
                .endAt(session.getEndAt())
                .sessionType(session.getSessionType())
                .sessionPosters(imageUrls)
                .build();
    }


    public void updateSession(Long sessionId, SessionRequest.UpdateSessionRequest updateSessionRequest, CustomUser customUser) {

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(NotFoundSessionException::new);
        if (!session.getHost().getEmail().equals(member.getEmail())) {
            throw new SessionAuthorizationException();
        }
        Course course = courseRepository.findById(updateSessionRequest.getCourseId())
                .orElseThrow(NotFoundCourseException::new);

        session.updateSession(updateSessionRequest, course);
        sessionRepository.save(session);
    }

    public void deleteSession(Long sessionId, CustomUser customUser) {
        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(NotFoundSessionException::new);

        if (session.getStartAt().isBefore(LocalDateTime.now())) {
            throw new SessionInProgressException();
        }

        if (!session.getHost().getEmail().equals(member.getEmail())) {
            throw new SessionAuthorizationException();
        }
        sessionRepository.delete(session);
    }

    private SessionResponse convertToSessionResponse(Session session) {
        List<SessionPoster> sessionPosters = sessionPosterRepository.findBySessionOrderByImageUrlAsc(session);
        String sessionThumbnail = sessionPosters.isEmpty() ? null : sessionPosters.get(0).getImageUrl();
        String crewName = "";
        if(session.getCrew() != null)
            crewName = session.getCrew().getCrewName();

        return SessionResponse.builder()
                .sessionId(session.getId())
                .sessionThumbnail(sessionThumbnail)
                .crewName(crewName)
                .sessionName(session.getName())
                .spot(session.getSpot())
                .area(session.getArea())
                .sessionType(session.getSessionType())
                .maxPeople(session.getMaxPeople())
                .startAt(session.getStartAt())
                .build();
    }

    public List<SessionResponse> getSessionsByStatusAndType(String status, SessionType sessionType) {
        List<Session> sessions = sessionQueryRepository.findSessionsByStatusAndType(status, sessionType);
        return sessions.stream().map(this::convertToSessionResponse).collect(Collectors.toList());
    }

    public SessionGalleryItemsResponse getSessionGallery(int pageNo, Long sessionId, CustomUser customUser) {
        PageRequest pageRequest = PageRequest.of(pageNo, 27);
        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(MemberNotFoundException::new);
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(NotFoundSessionException::new);
        memberSessionRepository.findByMemberAndSession(member, session)
                .orElseThrow(NotFoundMemberSessionException::new);


        Page<SessionImage> sessionImageListPage = sessionImageRepository.findBySession(session, pageRequest);

        return convertToGalleryItemResponse(pageNo, sessionImageListPage);
    }

    //Page<SessionImage>를 받아서 갤러리 response로 변환
    private SessionGalleryItemsResponse convertToGalleryItemResponse(int pageNo, Page<SessionImage> sessionImageListPage) {
        List<SessionImage> sessionImageList = sessionImageListPage.getContent();
        int lastPageNo = Math.max(sessionImageListPage.getTotalPages() - 1, 0);
        List<SessionGalleryItem> sessionGalleryItems = sessionImageList.stream()
                .map(sessionImage -> SessionGalleryItem.builder()
                        .sessionImageId(sessionImage.getId())
                        .ThumbnailImage(sessionImage.getImageUrl())
                        .build()
                )
                .toList();
        return SessionGalleryItemsResponse.builder()
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .sessionImages(sessionGalleryItems)
                .build();
    }

    public void applySession(){

    }

}
