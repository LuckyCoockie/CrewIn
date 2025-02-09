package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.*;
import com.luckycookie.crewin.domain.enums.Position;
import com.luckycookie.crewin.domain.enums.SessionType;
import com.luckycookie.crewin.dto.SessionRequest.CreateSessionRequest;
import com.luckycookie.crewin.dto.SessionRequest.UpdateSessionRequest;
import com.luckycookie.crewin.dto.SessionRequest.UploadSessionImageRequest;
import com.luckycookie.crewin.dto.SessionResponse.SessionItem;
import com.luckycookie.crewin.dto.base.PagingItemsResponse;
import com.luckycookie.crewin.exception.course.NotFoundCourseException;
import com.luckycookie.crewin.exception.crew.CrewUnauthorizedException;
import com.luckycookie.crewin.exception.crew.NotFoundCrewException;
import com.luckycookie.crewin.exception.member.MemberNotFoundException;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.exception.memberCrew.NotFoundMemberCrewException;
import com.luckycookie.crewin.exception.memberSession.DuplicateApplyException;
import com.luckycookie.crewin.exception.memberSession.NotFoundMemberSessionException;
import com.luckycookie.crewin.exception.session.*;
import com.luckycookie.crewin.exception.sessionImage.SessionImageUploadException;
import com.luckycookie.crewin.repository.*;
import com.luckycookie.crewin.security.dto.CustomUser;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static com.luckycookie.crewin.domain.enums.SessionType.*;
import static com.luckycookie.crewin.dto.SessionResponse.*;


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
    private final S3Service s3Service;

    @Value("${image.default.session-poster}")
    private String defaultSessionPoster;


    public SessionCreateResponse createSession(CreateSessionRequest createSessionRequest, CustomUser customUser) {

        // 현재 로그인한 사용자
        Member member = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        // 번개런 -> crewId 가 null 이어야 함
        if (createSessionRequest.getSessionType() == SessionType.THUNDER) {
            if (createSessionRequest.getCrewId() != null) {
                throw new InvalidSessionException(); // null이 아니면 exception
            }
        } else { // 정규런, 오픈런 -> crewId가 null이면 안됨
            if (createSessionRequest.getCrewId() == null) {
                throw new InvalidSessionException(); // null이면 exception
            }
        }

        if (createSessionRequest.getStartAt().isAfter(createSessionRequest.getEndAt()) ||
                createSessionRequest.getStartAt().isBefore(LocalDateTime.now())) {
            throw new InvalidSessionException();
        }

        Crew crew = null;
        MemberCrew memberCrew = null;
        if (createSessionRequest.getCrewId() != null) {
            crew = crewRepository.findById(createSessionRequest.getCrewId()).orElseThrow(NotFoundCrewException::new);
            memberCrew = memberCrewRepository.findByMemberAndCrew(member, crew).orElseThrow(NotFoundMemberCrewException::new);
        }

        Course course = courseRepository.findById(createSessionRequest.getCourseId())
                .orElseThrow(NotFoundCourseException::new);

        List<String> sessionPosterUrls = new ArrayList<>();

        if (createSessionRequest.getImages().isEmpty()) {
            sessionPosterUrls.add(defaultSessionPoster);
        } else {
            sessionPosterUrls.addAll(createSessionRequest.getImages());
        }

        Session session = Session.builder()
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

        List<SessionPoster> sessionPosters = sessionPosterUrls.stream().map(url ->
                SessionPoster.builder().imageUrl(url).build()
        ).toList();

        session.setSessionPosters(sessionPosters);

        if (createSessionRequest.getSessionType() != THUNDER) { // 정규런, 오픈런일 때
            assert memberCrew != null;
            if (memberCrew.getPosition() == Position.MEMBER) { // 만약 position이 member면 exception
                throw new CrewUnauthorizedException(); // 권한 부족
            } else { // 내가 CAPTAIN, PACER 일 때만 가능
                session = sessionRepository.save(session);
            }
        } else {
            session = sessionRepository.save(session);
        }

        memberSessionRepository
                .save(MemberSession.builder()
                        .member(member)
                        .session(session)
                        .isAttend(true)
                        .build());

        return SessionCreateResponse.builder()
                .sessionId(session.getId())
                .build();
    }

    public SessionDetailResponse getSessionDetail(Long sessionId, CustomUser customUser) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(NotFoundSessionException::new);

        Member host = memberRepository.findById(session.getHost().getId())
                .orElseThrow(NotFoundMemberException::new);

        Member member = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        boolean userSessionCompare;
        userSessionCompare = customUser.getEmail().equals(host.getEmail());

        Course course = courseRepository.findById(session.getCourse().getId())
                .orElseThrow(NotFoundCourseException::new);

        // 현재 세션에 참가한 사람
        List<MemberSession> memberSessionList = memberSessionRepository.findBySession(session);

        // 내가 현재 이 세션에 참가 중인지 아닌지
        Boolean isJoined = memberSessionList.stream().anyMatch(memberSession -> memberSession.getMember().equals(member));

        String crewName = null;
        if (session.getSessionType() != THUNDER) {
            crewName = session.getCrew().getCrewName();
        }

        return SessionDetailResponse.builder()
                .sessionId(session.getId())
                .courseId(session.getCourse().getId())
                .isSessionHost(userSessionCompare)
                .hostname(host.getName())
                .area(session.getArea())
                .hostNickname(host.getNickname())
                .crewName(crewName)
                .isJoined(isJoined)
                .sessionName(session.getName())
                .spot(session.getSpot())
                .content(session.getContent())
                .currentPeople(memberSessionList.size())
                .courseThumbnail(course.getThumbnailImage())
                .maxPeople(session.getMaxPeople())
                .pace(session.getPace())
                .startAt(session.getStartAt())
                .endAt(session.getEndAt())
                .sessionType(session.getSessionType())
                .sessionPosters(session.getPosterImages().stream().map(SessionPoster::getImageUrl).toList())
                .courseDistance(Math.round(course.getLength() / 1000.0 * 10.0) / 10.0)
                .isMyCrew(memberCrewRepository.existsByMemberAndCrew(member, session.getCrew()))
                .build();
    }


    public void updateSession(Long sessionId, UpdateSessionRequest updateSessionRequest, CustomUser customUser) {

        Member member = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(NotFoundSessionException::new);
        if (!session.getHost().getEmail().equals(member.getEmail())) {
            throw new SessionAuthorizationException();
        }
        Course course = courseRepository.findById(updateSessionRequest.getCourseId())
                .orElseThrow(NotFoundCourseException::new);

        // 기존 세션 포스터 이미지 List
        List<String> sessionPosterUrls = sessionPosterRepository.findBySession(session).stream()
                .map(SessionPoster::getImageUrl)
                .toList();

        // update 할 세션 포스터 이미지 List
        List<String> updateSessionPosterUrls = updateSessionRequest.getImages();

        if (!updateSessionPosterUrls.isEmpty()) {
            // 더 큰 리스트 크기를 기준으로 비교
            int maxSize = Math.max(sessionPosterUrls.size(), updateSessionPosterUrls.size());

            // 기존 이미지 삭제 여부를 체크하기 위한 리스트
            List<Boolean> toBeDeleted = new ArrayList<>(Collections.nCopies(sessionPosterUrls.size(), false));

            for (int i = 0; i < maxSize; i++) {
                if (i < sessionPosterUrls.size() && (i >= updateSessionPosterUrls.size() || !sessionPosterUrls.get(i).equals(updateSessionPosterUrls.get(i)))) {
                    // 기존 이미지 URL 리스트와 update 할 이미지 URL 리스트 비교해서
                    // 기존 이미지와 update 할 이미지가 다르면 기존 이미지 삭제
                    toBeDeleted.set(i, true);
                }
            }

            // 기존 이미지 삭제
            for (int i = 0; i < sessionPosterUrls.size(); i++) {
                if (toBeDeleted.get(i)) {
                    s3Service.deleteImage(sessionPosterUrls.get(i));
                }
            }
        } else {
            // 이미지가 없으면 기본 이미지 넣어주기
            if (updateSessionRequest.getImages().isEmpty()) {
                updateSessionRequest.getImages().add(defaultSessionPoster);
            }
        }

        session.updateSession(updateSessionRequest, course);
        sessionRepository.save(session);
    }

    public void deleteSession(Long sessionId, CustomUser customUser) {
        Member member = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(NotFoundSessionException::new);

        if (session.getStartAt().isBefore(LocalDateTime.now())) {
            throw new SessionInProgressException();
        }

        if (!session.getHost().getEmail().equals(member.getEmail())) {
            throw new SessionAuthorizationException();
        }

        List<String> sessionPosterUrls = sessionPosterRepository.findBySession(session).stream()
                .map(SessionPoster::getImageUrl)
                .toList();

        for (String sessionPosterUrl : sessionPosterUrls) {
            s3Service.deleteImage(sessionPosterUrl);
        }

        sessionRepository.delete(session);
    }

    public PagingItemsResponse<SessionItem> getSessionsByStatusAndTypeAndCrewNameAndDate(String status, SessionType sessionType, String query, LocalDate date, int pageNo) {
        PageRequest pageRequest = PageRequest.of(pageNo, 10);
        Page<Session> sessionPage = sessionQueryRepository.findSessionsByStatusAndTypeAndCrewNameAndDate(status, sessionType, query, date, pageRequest);
        int lastPageNo = Math.max(sessionPage.getTotalPages() - 1, 0);

        List<SessionItem> sessionItems = sessionPage.getContent().stream().map(
                session ->
                {
                    String sessionCrewName = null;
                    if (session.getSessionType() != THUNDER) {
                        sessionCrewName = session.getCrew().getCrewName();
                    }

                    List<MemberSession> memberSessionList = memberSessionRepository.findBySession(session);

                    return SessionItem.builder().crewName(sessionCrewName)
                            .sessionName(session.getName())
                            .spot(session.getSpot())
                            .area(session.getArea())
                            .sessionThumbnail(session.getPosterImages().get(0).getImageUrl())
                            .sessionType(session.getSessionType())
                            .maxPeople(session.getMaxPeople())
                            .currentPeople(memberSessionList.size())
                            .sessionId(session.getId())
                            .startAt(session.getStartAt())
                            .build();
                }
        ).toList();

        return PagingItemsResponse.<SessionItem>builder()
                .items(sessionItems)
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .build();
    }

    public PagingItemsResponse<SessionGalleryItem> getSessionGallery(int pageNo, Long sessionId, CustomUser customUser) {
        PageRequest pageRequest = PageRequest.of(pageNo, 27);
        Member member = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(MemberNotFoundException::new);
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(NotFoundSessionException::new);
        memberSessionRepository.findByMemberAndSession(member, session)
                .orElseThrow(NotFoundMemberSessionException::new);


        Page<SessionImage> sessionImageListPage = sessionImageRepository.findBySessionOrderByIdDesc(session, pageRequest);

        return convertToGalleryItemResponse(pageNo, sessionImageListPage);
    }

    // Page<SessionImage>를 받아서 갤러리 response로 변환
    private PagingItemsResponse<SessionGalleryItem> convertToGalleryItemResponse(int pageNo, Page<SessionImage> sessionImageListPage) {
        List<SessionImage> sessionImageList = sessionImageListPage.getContent();
        int lastPageNo = Math.max(sessionImageListPage.getTotalPages() - 1, 0);
        List<SessionGalleryItem> sessionGalleryItems = sessionImageList.stream()
                .map(sessionImage -> SessionGalleryItem.builder()
                        .sessionImageId(sessionImage.getId())
                        .imageUrl(sessionImage.getImageUrl())
                        .build()
                )
                .toList();
        return PagingItemsResponse.<SessionGalleryItem>builder()
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .items(sessionGalleryItems)
                .build();
    }

    // 세션 사진첩 사진 업로드
    public void uploadSessionImage(UploadSessionImageRequest uploadSessionImageRequest, CustomUser customUser) {

        Session session = sessionRepository.findById(uploadSessionImageRequest.getSessionId())
                .orElseThrow(NotFoundSessionException::new);

        // 내가 그 세션에 참여 했는지 안했는지 검증
        Member member = memberRepository.findFirstByEmail(customUser.getEmail()).orElseThrow(NotFoundMemberException::new);
        memberSessionRepository.findByMemberAndSession(member, session).orElseThrow(NotFoundMemberSessionException::new);

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
    }

    // 세션 사진 삭제
    public void deleteSessionImage(Long sessionImageId, CustomUser customUser) {

        Member member = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        SessionImage sessionImage = sessionImageRepository.findById(sessionImageId).orElseThrow(SessionImageUploadException::new);
        if (!memberSessionRepository.existsByMemberAndSession(member, sessionImage.getSession())) {
            throw new NotFoundMemberSessionException();
        }
        s3Service.deleteImage(sessionImage.getImageUrl());

        sessionImageRepository.delete(sessionImage);
    }

    // 세션 참가 신청
    public void applySession(Long sessionId, String email) {
        Member member = memberRepository.findFirstByEmail(email).orElseThrow(NotFoundMemberException::new);
        Session session = sessionRepository.findById(sessionId).orElseThrow(NotFoundSessionException::new);

        // 호스트가 신청하거나, 신청시간이 세션 시작 이후면 안 받음
        if (session.getHost().getId().equals(member.getId()) ||
                LocalDateTime.now().isAfter(session.getStartAt()) ||
                LocalDateTime.now().isAfter(session.getEndAt())
        ) {
            throw new InvalidSessionException();
        }

        if (memberSessionRepository.existsByMemberAndSession(member, session)) {
            throw new DuplicateApplyException();
        }

        // 현재 신청한 인원
        List<MemberSession> memberSessionList = memberSessionRepository.findBySession(session);
        // 신청 인원이 최대 인원 넘어 갔으면 예외 처리
        if (session.getMaxPeople() < memberSessionList.size()) {
            throw new SessionMaxMemberException();
        }

        // 크루원이 아닌 회원이 정규런 신청할 경우 예외처리
        if (session.getSessionType() == STANDARD) {
            MemberCrew memberCrew = memberCrewRepository.findByMemberAndCrew(member, session.getCrew()).orElseThrow(NotFoundMemberCrewException::new);
            if (!memberCrew.getIsJoined())
                throw new SessionAuthorizationException();
        }

        MemberSession memberSession = MemberSession.builder()
                .member(member)
                .session(session)
                .isAttend(false).build();
        memberSessionRepository.save(memberSession);
    }

    public void cancelSessionRequest(Long sessionId, String email) {
        Member member = memberRepository.findFirstByEmail(email)
                .orElseThrow(NotFoundMemberException::new);
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(NotFoundSessionException::new);
        MemberSession memberSession = memberSessionRepository.findByMemberAndSession(member, session)
                .orElseThrow(NotFoundMemberSessionException::new);

        // 이미 진행된 세션은 참가 취소 불가능
        if (session.getStartAt().isBefore(LocalDateTime.now())) {
            throw new InvalidSessionException();
        }

        memberSessionRepository.delete(memberSession);
    }

}
