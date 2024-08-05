package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.*;
import com.luckycookie.crewin.domain.enums.Position;
import com.luckycookie.crewin.domain.enums.SessionType;
import com.luckycookie.crewin.dto.*;
import com.luckycookie.crewin.dto.SessionImageResponse.SessionGalleryItem;
import com.luckycookie.crewin.dto.SessionImageResponse.SessionGalleryItemsResponse;
import com.luckycookie.crewin.dto.SessionRequest.UploadSessionImageRequest;
import com.luckycookie.crewin.exception.course.NotFoundCourseException;
import com.luckycookie.crewin.exception.crew.CrewMemberNotExistException;
import com.luckycookie.crewin.exception.crew.NotFoundCrewException;
import com.luckycookie.crewin.exception.member.MemberNotFoundException;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.exception.memberSession.DuplicateApplyException;
import com.luckycookie.crewin.exception.memberSession.InvalidSessionRequestException;
import com.luckycookie.crewin.exception.memberSession.NotFoundMemberSessionException;
import com.luckycookie.crewin.exception.session.InvalidSessionException;
import com.luckycookie.crewin.exception.session.NotFoundSessionException;
import com.luckycookie.crewin.exception.session.SessionAuthorizationException;
import com.luckycookie.crewin.exception.session.SessionInProgressException;
import com.luckycookie.crewin.exception.sessionImage.SessionImageUploadException;
import com.luckycookie.crewin.repository.*;
import com.luckycookie.crewin.security.dto.CustomUser;
import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static com.luckycookie.crewin.domain.enums.SessionType.*;


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

        memberSessionRepository.save(MemberSession.builder()
                .member(member)
                .session(session)
                .build());
    }

    public SessionDetailResponse getSessionDetail(Long sessionId, CustomUser customUser) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(NotFoundSessionException::new);

        if (session.getSessionType().equals(STANDARD)) {
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
        if (session.getCrew() != null)
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

    public List<SessionResponse> getSessionsByStatusAndTypeAndCrewName(String status, SessionType sessionType, String crewName) {
        List<Session> sessions = sessionQueryRepository.findSessionsByStatusAndTypeAndCrewName(status, sessionType, crewName);
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

    // Page<SessionImage>를 받아서 갤러리 response로 변환
    private SessionGalleryItemsResponse convertToGalleryItemResponse(int pageNo, Page<SessionImage> sessionImageListPage) {
        List<SessionImage> sessionImageList = sessionImageListPage.getContent();
        int lastPageNo = Math.max(sessionImageListPage.getTotalPages() - 1, 0);
        List<SessionGalleryItem> sessionGalleryItems = sessionImageList.stream()
                .map(sessionImage -> SessionGalleryItem.builder()
                        .sessionImageId(sessionImage.getId())
                        .imageUrl(sessionImage.getImageUrl())
                        .build()
                )
                .toList();
        return SessionGalleryItemsResponse.builder()
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .sessionImages(sessionGalleryItems)
                .build();
    }

    // 세션 사진첩 사진 업로드
    public void uploadSessionImage(UploadSessionImageRequest uploadSessionImageRequest, CustomUser customUser) {

        Session session = sessionRepository.findById(uploadSessionImageRequest.getSessionId())
                .orElseThrow(NotFoundSessionException::new);

        // 내가 그 세션에 참여 했는지 안했는지 검증
        Member member = memberRepository.findByEmail(customUser.getEmail()).orElseThrow(NotFoundMemberException::new);
        MemberSession memberSession = memberSessionRepository.findByMemberAndSession(member, session).orElseThrow(NotFoundMemberSessionException::new);

        if (memberSession.getIsAttend()) { // 참석 했음`
            if (uploadSessionImageRequest.getSessionImageUrls() != null) {
                for (String imageUrl : uploadSessionImageRequest.getSessionImageUrls()) {
                    SessionImage sessionImage = SessionImage
                            .builder()
                            .session(session)
                            .imageUrl(imageUrl)
                            .build();
                    sessionImageRepository.save(sessionImage);
                }
            } else {
                throw new SessionImageUploadException();
            }
        } else { // 참석 안함
            throw new NotFoundMemberSessionException();
        }
    }

    public void applySession(Long sessionId, String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow(NotFoundMemberException::new);
        Session session = sessionRepository.findById(sessionId).orElseThrow(NotFoundSessionException::new);

            // 호스트가 신청하거나, 신청시간이 세션 시작 이후면 안 받음
            if (session.getHost().getId().equals(member.getId()) ||
                    LocalDateTime.now().isAfter(session.getStartAt())
            ) {
                throw new InvalidSessionException();
            }

            if (memberSessionRepository.existsByMemberAndSession(member, session)) {
                throw new DuplicateApplyException();
            }

            boolean joinStatus = false;
            if (session.getSessionType() != THUNDER) {
                joinStatus = memberCrewRepository.existsByMemberAndCrew(member, session.getCrew());
            }

            // 크루원이 아닌 회원이 정규런 신청할 경우 예외처리
            if (session.getSessionType() == STANDARD && !joinStatus) {
                throw new SessionAuthorizationException();
            } else if (session.getSessionType() == OPEN && !joinStatus) {
                // 크루원 아닌 회원이 오픈런 신청할 경우 멤버-크루 테이블에 넣어줌
                MemberCrew memberCrew = MemberCrew.builder()
                        .member(member)
                        .crew(session.getCrew())
                        .build();
                memberCrewRepository.save(memberCrew);
            }

            MemberSession memberSession = MemberSession.builder()
                    .member(member)
                    .session(session)
                    .isAttend(false).build();
            memberSessionRepository.save(memberSession);
    }

    public void cancelSessionRequest(Long sessionId, String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(NotFoundMemberException::new);
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(NotFoundSessionException::new);
        MemberSession memberSession = memberSessionRepository.findByMemberAndSession(member, session)
                .orElseThrow(NotFoundMemberSessionException::new);

        // 이미 진행된 세션은 참가 취소 불가능
        if (session.getStartAt().isBefore(LocalDateTime.now())) {
            throw new InvalidSessionRequestException();
        }

        memberSessionRepository.delete(memberSession);
    }

}
