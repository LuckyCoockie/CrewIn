package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.*;
import com.luckycookie.crewin.domain.enums.NotificationType;
import com.luckycookie.crewin.domain.enums.Position;
import com.luckycookie.crewin.domain.enums.PostType;
import com.luckycookie.crewin.dto.CrewRequest.*;
import com.luckycookie.crewin.dto.CrewResponse.*;
import com.luckycookie.crewin.dto.PostResponse;
import com.luckycookie.crewin.dto.base.PagingItemsResponse;
import com.luckycookie.crewin.exception.crew.*;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.exception.memberCrew.NotFoundMemberCrewException;
import com.luckycookie.crewin.exception.post.NotFoundPostException;
import com.luckycookie.crewin.repository.*;
import com.luckycookie.crewin.security.dto.CustomUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

import static com.luckycookie.crewin.domain.enums.NotificationType.INVITATION;
import static com.luckycookie.crewin.domain.enums.NotificationType.NOTICE;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CrewService {

    private final CrewRepository crewRepository;
    private final MemberRepository memberRepository;
    private final MemberCrewRepository memberCrewRepository;
    private final PostRepository postRepository;
    private final PostImageRepository postImageRepository;
    private final NotificationService notificationService;
    private final HeartRepository heartRepository;
    private final NotificationRepository notificationRepository;
    private final S3Service s3Service;

    @Value("${image.default.crew-main-logo}")
    private String defaultMainLogo;
    @Value("${image.default.crew-sub-logo}")
    private String defaultSubLogo;
    @Value("${image.default.crew-banner}")
    private String defaultBanner;

    public Crew createCrew(CrewInfoRequest crewInfoRequest, CustomUser customUser) {

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        Crew crew = Crew
                .builder()
                .captain(member)
                .crewName(crewInfoRequest.getName())
                .slogan(crewInfoRequest.getSlogan())
                .introduction(crewInfoRequest.getIntroduction())
                .area(crewInfoRequest.getArea())
                .mainLogo(crewInfoRequest.getMainLogo())
                .subLogo(crewInfoRequest.getSubLogo())
                .banner(crewInfoRequest.getBanner())
                .crewBirth(crewInfoRequest.getCrewBirth())
                .build();

        crewRepository.save(crew);

        // MemberCrew 에 CAPTAIN 지정
        MemberCrew memberCrew = MemberCrew.builder()
                .member(member)
                .crew(crew)
                .position(Position.CAPTAIN)
                .isInvited(true)
                .isJoined(true)
                .build();

        memberCrewRepository.save(memberCrew);

        return crew;

    }

    // 내가 속한 크루 조회
    @Transactional(readOnly = true)
    public MyCrewItemResponse getMyCrewList(CustomUser customUser) {
        // 사용자 정보 가져오기
        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        List<MemberCrew> crews = memberCrewRepository.findCrewByMemberAndIsJoined(member);

        List<MyCrewItem> crewItems = crews.stream().map(memberCrew -> {
            Crew crew = memberCrew.getCrew();
            int crewCount = crewRepository.countMembersByCrew(crew);
            String captainName = crew.getCaptain().getName();

            return MyCrewItem.builder()
                    .crewId(crew.getId())
                    .crewName(crew.getCrewName())
                    .slogan(crew.getSlogan())
                    .area(crew.getArea())
                    .crewCount(crewCount)
                    .captainName(captainName)
                    .mainLogo(crew.getMainLogo())
                    .subLogo(crew.getSubLogo())
                    .banner(crew.getBanner())
                    .position(memberCrew.getPosition())
                    .build();
        }).collect(Collectors.toList());

        return MyCrewItemResponse.builder()
                .crews(crewItems)
                .build();
    }


    public void createCrewNotice(CreateCrewNoticeRequest createCrewNoticeRequest, CustomUser customUser) {

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Crew crew = crewRepository.findById(createCrewNoticeRequest.getCrewId()).orElseThrow(NotFoundCrewException::new);

        // 크루 공지는 Pacer 이상
        Position position = memberCrewRepository.findPositionByMemberAndCrew(member, crew).orElseThrow(NotFoundMemberCrewException::new);

        // MEMBER 가 아닐 때만
        if (position != Position.MEMBER) {
            Post post = Post
                    .builder()
                    .crew(crew)
                    .author(member)
                    .isPublic(false)
                    .content(createCrewNoticeRequest.getContent())
                    .title(createCrewNoticeRequest.getTitle())
                    .postType(PostType.NOTICE)
                    .build();

            postRepository.save(post);

            // 이미지 넣어주기
            if (createCrewNoticeRequest.getNoticeImages() != null) {
                for (String imageUrl : createCrewNoticeRequest.getNoticeImages()) {
                    PostImage postImage = PostImage.builder()
                            .post(post)
                            .imageUrl(imageUrl)
                            .build();
                    postImageRepository.save(postImage);
                }
            }

            // 작성자 제외한 멤버들에 대한 알림 생성
            List<MemberCrew> memberCrewList = memberCrewRepository.findByCrew(crew);
            for (MemberCrew memberCrew : memberCrewList) {
                Member crewMember = memberCrew.getMember();
                // 작성자 자신은 제외하고 크루원에게 알림을 생성
                if (!crewMember.equals(member)) {
                    notificationService.createNotification(NOTICE, crew.getId(), crewMember.getId(), post.getId());
                }
            }

        }

    }

    @Transactional(readOnly = true)
    // 크루 정보 조회
    public CrewInfoItem getCrewInfo(Long crewId) {

        // 크루 정보 가져오기
        Crew crew = crewRepository.findById(crewId)
                .orElseThrow(NotFoundCrewException::new);

        // 크루 인원 수 가져오기
        int crewCount = crewRepository.countMembersByCrew(crew);

        // 크루 정보
        return CrewInfoItem
                .builder()
                .crewId(crewId)
                .crewName(crew.getCrewName())
                .area(crew.getArea())
                .slogan(crew.getSlogan())
                .crewCount(crewCount)
                .captainName(crew.getCaptain().getName())
                .mainLogo(crew.getMainLogo())
                .subLogo(crew.getSubLogo())
                .banner(crew.getBanner())
                .introduction(crew.getIntroduction())
                .crewBirth(crew.getCrewBirth())
                .build();

    }

    // 크루 정보 수정
    public void updateCrewInfo(Long crewId, CrewInfoRequest crewInfoRequest, CustomUser customUser) {
        Crew crew = crewRepository.findById(crewId).orElseThrow(NotFoundCrewException::new);

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        Position position = memberCrewRepository.findPositionByMemberAndCrew(member, crew).orElseThrow(CrewPositionMismatchException::new);

        // CAPTAIN 만 수정 가능
        if (position == Position.CAPTAIN) {
            if (crewInfoRequest.getMainLogo() == null) {
                crewInfoRequest.setMainLogo(defaultMainLogo);
            }
            if (crewInfoRequest.getSubLogo() == null) {
                crewInfoRequest.setSubLogo(defaultSubLogo);
            }
            if (crewInfoRequest.getBanner() == null) {
                crewInfoRequest.setBanner(defaultBanner);
            }

            // 기존 크루 메인 로고, 서브 로고, 배너 삭제 (S3)
            // 기존 이미지와 update 할 이미지 url 이 다르면 기존꺼 지우고, 같으면 지우지 말고
            if (!crew.getMainLogo().equals(crewInfoRequest.getMainLogo())) {
                s3Service.deleteImage(crew.getMainLogo()); // 기존 이미지 삭제
            }
            if (!crew.getSubLogo().equals(crewInfoRequest.getSubLogo())) {
                s3Service.deleteImage(crew.getSubLogo()); // 기존 이미지 삭제
            }
            if (!crew.getBanner().equals(crewInfoRequest.getBanner())) {
                s3Service.deleteImage(crew.getBanner()); // 기존 이미지 삭제
            }

            crew.updateCrewInfo(crewInfoRequest);
        } else {
            throw new CrewUnauthorizedException();
        }
    }

    // 크루 정보 삭제
    public void deleteCrewInfo(Long crewId, CustomUser customUser) {
        Crew crew = crewRepository.findById(crewId).orElseThrow(NotFoundCrewException::new);

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        Position position = memberCrewRepository.findPositionByMemberAndCrew(member, crew).orElseThrow(CrewPositionMismatchException::new);

        // CAPTAIN 만 삭제 가능
        if (position == Position.CAPTAIN) {
            // MemberCrew 먼저 삭제
            memberCrewRepository.deleteByCrew(crew);

            // 크루 메인 로고, 서브 로고, 배너 삭제 (S3)
            s3Service.deleteImage(crew.getMainLogo());
            s3Service.deleteImage(crew.getSubLogo());
            s3Service.deleteImage(crew.getBanner());

            // 초대, 공지 알림 삭제
            notificationRepository.deleteNoticeAndInvitationByCrewId(List.of(NOTICE, INVITATION), crew.getId());

            // Crew 삭제
            crewRepository.delete(crew);
        } else {
            throw new CrewUnauthorizedException();
        }
    }

    public void quitCrew(Long crewId, CustomUser customUser) {

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Crew crew = crewRepository.findById(crewId)
                .orElseThrow(NotFoundCrewException::new);
        MemberCrew memberCrew = memberCrewRepository.findByMemberAndCrew(member, crew)
                .orElseThrow(NotFoundMemberCrewException::new);

        if (memberCrew.getPosition().equals(Position.CAPTAIN)) {
            //캡틴은 탈퇴 불가. 크루 삭제나 권한 위임 후 탈퇴
            throw new CaptainQuitErrorException();
        }

        //크루 태그한 게시물들을 찾아서 null 처리
        postRepository.updateCrewIdToNull(member, crew);
        memberCrewRepository.deleteByMemberAndCrew(member, crew);

    }

    // 공지사항 조회
    @Transactional(readOnly = true)
    public PagingItemsResponse<CrewNoticeItem> getCrewNoticeList(int pageNo, Long crewId, CustomUser customUser) {
        Pageable pageable = PageRequest.of(pageNo, 10); // pageNo 페이지 번호, 10 : 페이지 크기

        // 현재 사용자 정보 가져오기
        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        Crew crew = crewRepository.findById(crewId).orElseThrow(NotFoundCrewException::new);

        // 해당 멤버의 position
        Position position = memberCrewRepository.findPositionByMemberAndCrew(member, crew).orElseThrow(CrewPositionMismatchException::new);

        // 해당 크루의 공지사항 게시물 가져오기
        Page<Post> noticeListPage = postRepository.findByCrewAndPostType(crew, PostType.NOTICE, pageable);
        List<Post> noticeList = noticeListPage.getContent();
        int lastPageNo = Math.max(noticeListPage.getTotalPages() - 1, 0);

        List<CrewNoticeItem> crewNoticeItems = noticeList.stream().map(notice -> CrewNoticeItem
                .builder()
                .position(position)
                .title(notice.getTitle())
                .createdAt(notice.getCreatedAt())
                .updatedAt(notice.getUpdatedAt())
                .noticeId(notice.getId())
                .build()).collect(Collectors.toList());

        return PagingItemsResponse.<CrewNoticeItem>builder()
                .items(crewNoticeItems)
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .build();
    }

    // 크루 공지 수정
    public void updateNotice(Long noticeId, CreateCrewNoticeRequest createCrewNoticeRequest) {
        Post post = postRepository.findById(noticeId)
                .orElseThrow(NotFoundPostException::new);

        // 기존 이미지 URL 리스트 가져오기
        List<String> postImageUrls = post.getPostImages().stream()
                .map(PostImage::getImageUrl)
                .toList();

        // update 할 이미지 URL 리스트 가져오기
        List<String> updatePostImageUrls = createCrewNoticeRequest.getNoticeImages();

        // 더 큰 리스트 크기를 기준으로 비교
        int maxSize = Math.max(postImageUrls.size(), updatePostImageUrls.size());

        // 기존 이미지 삭제 여부를 체크하기 위한 리스트
        List<Boolean> toBeDeleted = new ArrayList<>(Collections.nCopies(postImageUrls.size(), false));

        for (int i = 0; i < maxSize; i++) {
            if (i < postImageUrls.size() && (i >= updatePostImageUrls.size() || !postImageUrls.get(i).equals(updatePostImageUrls.get(i)))) {
                // 기존 이미지 URL 리스트와 update 할 이미지 URL 리스트 비교해서
                // 기존 이미지와 update 할 이미지 URL 이 다르면 기존 이미지 삭제
                toBeDeleted.set(i, true);
            }
        }

        // 기존 이미지 삭제
        for (int i = 0; i < postImageUrls.size(); i++) {
            if (toBeDeleted.get(i)) {
                s3Service.deleteImage(postImageUrls.get(i));
            }
        }

        // 게시물 업데이트
        post.updateCrewNotice(createCrewNoticeRequest);
    }

    public void deleteNotice(Long noticeId) {
        Post post = postRepository.findByIdWithCrew(noticeId)
                .orElseThrow(NotFoundPostException::new);

        // 기존 이미지 URL 리스트 가져오기
        List<String> postImageUrls = post.getPostImages().stream()
                .map(PostImage::getImageUrl)
                .toList();

        // 기존 이미지 삭제
        for (String imageUrl : postImageUrls) {
            s3Service.deleteImage(imageUrl);
        }

        // 공지 알림 삭제
        notificationRepository.deleteByNotificationTypeAndSenderId(NOTICE, post.getCrew().getId());

        // 게시물 삭제
        postRepository.delete(post);
    }

    // 크루 권한 수정 (권한 부여)
    public void updateMemberCrewPosition(UpdateCrewPositionRequest updateCrewPositionRequest, CustomUser customUser) {
        // 현재 사용자가 CAPTAIN 일때만 가능함 (Exception 처리 해주기)

        // 현재 사용자 정보 가져오기
        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        Crew crew = crewRepository.findById(updateCrewPositionRequest.getCrewId()).orElseThrow(NotFoundCrewException::new);

        // 요청한 사람의 position
        Position position = memberCrewRepository.findPositionByMemberAndCrew(member, crew).orElseThrow(CrewUnauthorizedException::new);

        // 권한을 부여해야 할 사용자
        MemberCrew memberCrew = memberCrewRepository.findByMemberAndCrew(memberRepository.findById(updateCrewPositionRequest.getMemberId()).orElseThrow(NotFoundMemberCrewException::new), crew).orElseThrow(NotFoundMemberCrewException::new);

        // CAPTAIN 일때만
        if (position == Position.CAPTAIN) {
            // 권한 수정
            memberCrew.updatePosition(updateCrewPositionRequest.getPosition());
        } else {
            throw new CrewUnauthorizedException();
        }
    }

    // 크루원 조회 (일반, 대기 중 List 나눠서)
    // 일반 : isJoined (true), isInvited (true)
    // 대기 중 : isJoined (false), isInvited (true)
    @Transactional(readOnly = true)
    public PagingItemsResponse<CrewMemberItem> getCrewMemberList(Long crewId, int pageNo) {
        Crew crew = crewRepository.findById(crewId).orElseThrow(NotFoundCrewException::new);
        Pageable pageable = PageRequest.of(pageNo, 10);

        // 해당 크루에 있는 크루원 조회
        Page<MemberCrew> memberCrewPage = memberCrewRepository.findByCrewOrderByJoinedAndInvitedStatus(crew, pageable);
        List<CrewMemberItem> crewMemberItemList = new ArrayList<>();
        // MemberCrew 객체를 CrewMemberItem 객체로 변환하고 리스트에 추가
        for (MemberCrew memberCrew : memberCrewPage.getContent()) {
            crewMemberItemList.add(CrewMemberItem.builder()
                    .memberId(memberCrew.getMember().getId())
                    .nickname(memberCrew.getMember().getNickname())
                    .name(memberCrew.getMember().getName())
                    .email(memberCrew.getMember().getEmail())
                    .imageUrl(memberCrew.getMember().getImageUrl())
                    .isJoined(memberCrew.getIsJoined())
                    .isInvited(memberCrew.getIsInvited())
                    .position(memberCrew.getPosition())
                    .attendanceCount(memberCrew.getAttendanceCount())
                    .build()
            );

        }

        // CrewMemberItemResponse 객체 생성 및 반환
        return PagingItemsResponse.<CrewMemberItem>builder()
                .items(crewMemberItemList)
                .pageNo(memberCrewPage.getNumber())
                .lastPageNo(memberCrewPage.getTotalPages() - 1)
                .build();

    }

    // 크루 초대
    public void inviteCrewMember(CustomUser customUser, CrewMemberRequest crewMemberRequest) {

        // 요청자 (crewId)
        Member member = memberRepository.findByEmail(customUser.getEmail()).orElseThrow(NotFoundMemberException::new);

        Crew crew = crewRepository.findById(crewMemberRequest.getCrewId()).orElseThrow(NotFoundCrewException::new);
        Position position = memberCrewRepository.findPositionByMemberAndCrew(member, crew).orElseThrow(NotFoundCrewException::new);

        // 초대 당한 사람 (memberId)
        Member invitedMember = memberRepository.findById(crewMemberRequest.getMemberId()).orElseThrow(NotFoundMemberException::new);

        MemberCrew invitedMemberCrew = MemberCrew
                .builder()
                .member(invitedMember)
                .crew(crew)
                .position(Position.MEMBER)
                .isJoined(false)
                .isInvited(true)
                .build();

        if (position == Position.CAPTAIN) {
            // 이미 초대 요청이 보내진 멤버한테는 초대 요청을 보내면 안됨
            Optional<MemberCrew> memberCrew = memberCrewRepository.findByMemberAndCrew(invitedMember, crew);
            if (memberCrew.isEmpty()) { // 처음에 memberCrew 에 없었으면 초대 할 때 들어가고
                memberCrewRepository.save(invitedMemberCrew);
                notificationService.createNotification(NotificationType.INVITATION, crewMemberRequest.getCrewId(), crewMemberRequest.getMemberId(), null);
            } else { // memberCrew 에 있었으면 isInvited 체크
                if (memberCrew.orElseThrow().getIsInvited()) { // true 면 이미 중복된 요청
                    throw new CrewDupulicateException();
                } else { // false 면
                    memberCrew.get().updateInvited(true);  // 요청 보냈으니까 true 로 변경
                    notificationService.createNotification(NotificationType.INVITATION, crewMemberRequest.getCrewId(), crewMemberRequest.getMemberId(), null);
                }
            }
        } else {
            throw new CrewUnauthorizedException(); // CAPTAIN 만 초대 가능
        }

    }

    // 크루 수락, 거절
    public void replyCrewInvitation(CustomUser customUser, CrewReplyMemberRequest crewReplyMemberRequest) {
        // 초대한 사람 (어떤 크루 인지 crewId)
        Crew crew = crewRepository.findById(crewReplyMemberRequest.getCrewId()).orElseThrow(NotFoundCrewException::new);

        // 초대된 사람 (memberId)
        Member member = memberRepository.findByEmail(customUser.getEmail()).orElseThrow(NotFoundMemberException::new);

        MemberCrew memberCrew = memberCrewRepository.findByMemberAndCrew(member, crew).orElseThrow(NotFoundMemberCrewException::new);

        // 초대된 사람의 응답 (수락 or 거절)
        if (memberCrew.getPosition() == Position.MEMBER) {
            if (!memberCrew.getIsInvited()) {
                throw new CrewMemberInvitedException();
            } else {
                if (!memberCrew.getIsJoined()) { // isInvited는 true 이고, isJoined는 false인 상태면 초대 미수락 상태
                    memberCrew.updateMemberCrewInvitation(crewReplyMemberRequest.getReplyStatus());
                    notificationRepository.deleteById(crewReplyMemberRequest.getNoticeId());
                }
            }
        } else {
            throw new CrewUnauthorizedException(); // Member 일때만 가능 해야 함
        }

    }

    // CAPTAIN 승계
    public void updateCrewCaptain(UpdateCrewPositionRequest updateCrewPositionRequest, CustomUser customUser) {

        // 내가 CAPTAIN 이어야 승계 가능
        Member admin = memberRepository.findByEmail(customUser.getEmail()).orElseThrow(NotFoundMemberException::new);
        Crew crew = crewRepository.findById(updateCrewPositionRequest.getCrewId()).orElseThrow(NotFoundCrewException::new);
        MemberCrew adminMemberCrew = memberCrewRepository.findByMemberAndCrew(admin, crew).orElseThrow(NotFoundMemberCrewException::new);

        // 요청한 사람의 position
        Position adminPosition = memberCrewRepository.findByMemberAndCrew(admin, crew).orElseThrow(NotFoundMemberCrewException::new).getPosition();

        // 권한이 CAPTAIN 으로 바뀔 사용자
        Member member = memberRepository.findById(updateCrewPositionRequest.getMemberId()).orElseThrow(NotFoundMemberException::new);
        MemberCrew memberCrew = memberCrewRepository.findByMemberAndCrew(member, crew).orElseThrow(NotFoundMemberCrewException::new);

        // CAPTAIN 일때만
        if (adminPosition == Position.CAPTAIN) {
            // 권한 교환
            memberCrew.updatePosition(Position.CAPTAIN); // PACER 나 MEMBER 가 CAPTAIN 으로
            adminMemberCrew.updatePosition(updateCrewPositionRequest.getPosition()); // CAPTAIN 은 PACER 나 MEMBER 로
        } else {
            throw new CrewUnauthorizedException();
        }

    }


    // 크루 강퇴
    public void deleteCrewMember(CustomUser customUser, CrewMemberRequest crewMemberRequest) {
        // 강퇴 시키는 사람 (CAPTAIN)
        Member admin = memberRepository.findByEmail(customUser.getEmail()).orElseThrow(NotFoundMemberException::new);
        Crew adminCrew = crewRepository.findById(crewMemberRequest.getCrewId()).orElseThrow(NotFoundCrewException::new);
        Position adminPosition = memberCrewRepository.findPositionByMemberAndCrew(admin, adminCrew).orElseThrow();

        // 강퇴 당하는 사람 (MEMBER)
        Member member = memberRepository.findById(crewMemberRequest.getMemberId()).orElseThrow(NotFoundMemberException::new);
        Crew crew = crewRepository.findById(crewMemberRequest.getCrewId()).orElseThrow(NotFoundCrewException::new);
        MemberCrew memberCrew = memberCrewRepository.findByMemberAndCrew(member, crew).orElseThrow(NotFoundMemberCrewException::new);

        // 강퇴 시키는 사람이 CAPTAIN 인지 확인
        if (adminPosition == Position.CAPTAIN) {
            // 강퇴 당하는 사람이 크루에 속해있는지 확인
            if (memberCrew.getIsInvited() && memberCrew.getIsJoined()) { // 크루에 속해 있으면
                // 강퇴 당하는 사람은 MEMBER
                if (memberCrew.getPosition() == Position.MEMBER) {
                    memberCrewRepository.delete(memberCrew); // 강퇴
                } else {
                    throw new CrewMemberDeleteException();
                }
            } else {
                throw new CrewMemberNotExistException(); // 크루에 속해 있지 않음
            }
        } else {
            throw new CrewUnauthorizedException();
        }
    }

    //크루 공지 디테일
    public PostResponse.PostItem getNoticeDetail(CustomUser customUser, Long crewId, Long noticeId) {
        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Crew crew = crewRepository.findById(crewId)
                .orElseThrow(NotFoundCrewException::new);
        memberCrewRepository.findByMemberAndCrew(member, crew)
                .orElseThrow(NotFoundMemberCrewException::new);
        Post post = postRepository.findById(noticeId)
                .orElseThrow(NotFoundPostException::new);
        if (!post.getPostType().equals(PostType.NOTICE)) {
            throw new NotFoundPostException();
        }

        Boolean isHeartCheck = heartRepository.existsByPostAndMember(post, member);

        List<String> imageUrls = postImageRepository.findByPost(post).stream()
                .map(PostImage::getImageUrl)
                .collect(Collectors.toList());

        return PostResponse.PostItem.builder()
                .id(post.getId())
                .authorName(post.getAuthor().getName())
                .authorId(post.getAuthor().getId())
                .content(post.getContent())
                .heartCount(post.getHearts().size())
                .isHearted(isHeartCheck)
                .isPublic(post.getIsPublic())
                .postType(post.getPostType())
                .title(post.getTitle())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .postImages(imageUrls)
                .profileImage(member.getImageUrl())
                .build();

    }
}
