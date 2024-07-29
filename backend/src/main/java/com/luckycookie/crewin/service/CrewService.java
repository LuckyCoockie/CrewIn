package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.*;
import com.luckycookie.crewin.domain.enums.Position;
import com.luckycookie.crewin.domain.enums.PostType;
import com.luckycookie.crewin.dto.CrewRequest;
import com.luckycookie.crewin.dto.CrewRequest.CreateCrewNoticeRequest;
import com.luckycookie.crewin.dto.CrewRequest.CreateCrewRequest;
import com.luckycookie.crewin.dto.CrewRequest.CrewInvitedMemberRequest;
import com.luckycookie.crewin.dto.CrewRequest.CrewReplyMemberRequest;
import com.luckycookie.crewin.dto.CrewResponse;
import com.luckycookie.crewin.dto.CrewResponse.*;
import com.luckycookie.crewin.exception.crew.*;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.exception.memberCrew.NotFoundMemberCrewException;
import com.luckycookie.crewin.exception.post.NotFoundPostException;
import com.luckycookie.crewin.repository.*;
import com.luckycookie.crewin.security.dto.CustomUser;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CrewService {

    private final CrewRepository crewRepository;
    private final MemberRepository memberRepository;
    private final MemberCrewRepository memberCrewRepository;
    private final PostRepository postRepository;
    private final PostImageRepository postImageRepository;

    public void createCrew(CreateCrewRequest createCrewRequest, CustomUser customUser) {

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        Crew crew = Crew
                .builder()
                .captain(member)
                .crewName(createCrewRequest.getName())
                .slogan(createCrewRequest.getSlogan())
                .introduction(createCrewRequest.getIntroduction())
                .area(createCrewRequest.getArea())
                .mainLogo(createCrewRequest.getMainLogo())
                .subLogo(createCrewRequest.getSubLogo())
                .banner(createCrewRequest.getBanner())
                .crewBirth(createCrewRequest.getCrewBirth())
                .build();

        crewRepository.save(crew);

        // MemberCrew 에 CAPTAIN 지정
        MemberCrew memberCrew = MemberCrew.builder()
                .member(member)
                .crew(crew)
                .position(Position.CAPTAIN)
                .isJoined(true)
                .build();

        memberCrewRepository.save(memberCrew);

    }

    @Transactional(readOnly = true)
    public CrewItemResponse getAllCrewList(int pageNo) {
        Pageable pageable = PageRequest.of(pageNo, 10); // pageNo 페이지 번호, 10 : 페이지 크기

        Page<Crew> crewsPage;
        List<Crew> crews;
        int lastPageNo;

        crewsPage = crewRepository.findAllByCrew(pageable);

        crews = crewsPage.getContent();
        lastPageNo = Math.max(crewsPage.getTotalPages() - 1, 0);

        List<CrewItem> crewItems = crews.stream().map(crew -> {
            int crewCount = crewRepository.countMembersByCrewId(crew.getId());
            String captainName = crew.getCaptain().getName();

            return CrewItem.builder()
                    .crewId(crew.getId())
                    .crewName(crew.getCrewName())
                    .slogan(crew.getSlogan())
                    .area(crew.getArea())
                    .crewCount(crewCount)
                    .captainName(captainName)
                    .imageUrl(crew.getMainLogo())
                    .build();
        }).collect(Collectors.toList());

        return CrewItemResponse.builder()
                .crews(crewItems)
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .build();
    }

    @Transactional(readOnly = true)
    public CrewItemResponse getMyCrewList(int pageNo, CustomUser customUser) {
        Pageable pageable = PageRequest.of(pageNo, 10); // pageNo 페이지 번호, 10 : 페이지 크기

        Page<Crew> crewsPage;
        List<Crew> crews;
        int lastPageNo;

        // 사용자 정보 가져오기
        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        // MemberCrewRepository에서 member.getId()로 crewId List를 반환
        List<Long> crewIds = memberCrewRepository.findCrewIdsByMemberId(member.getId());

        // crewId에 해당하는 Crew 들을 페이징 처리하여 조회
        crewsPage = crewRepository.findByIdIn(crewIds, pageable);

        crews = crewsPage.getContent();
        lastPageNo = Math.max(crewsPage.getTotalPages() - 1, 0);

        List<CrewItem> crewItems = crews.stream().map(crew -> {
            int crewCount = crewRepository.countMembersByCrewId(crew.getId());
            String captainName = crew.getCaptain().getName();

            return CrewItem.builder()
                    .crewId(crew.getId())
                    .crewName(crew.getCrewName())
                    .slogan(crew.getSlogan())
                    .area(crew.getArea())
                    .crewCount(crewCount)
                    .captainName(captainName)
                    .imageUrl(crew.getMainLogo())
                    .build();
        }).collect(Collectors.toList());

        return CrewItemResponse.builder()
                .crews(crewItems)
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .build();
    }

    public void createCrewNotice(CreateCrewNoticeRequest createCrewNoticeRequest, CustomUser customUser) {

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Crew crew = crewRepository.findById(createCrewNoticeRequest.getCrewId()).orElseThrow(() -> new NotFoundCrewException(createCrewNoticeRequest.getCrewId()));

        // 크루 공지는 Pacer 이상
        Position position = memberCrewRepository.findPositionByMember(member, crew.getId()).orElseThrow(CrewPositionMismatchException::new);

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
        }

    }

    // 크루 정보 조회
    public CrewInfoItem getCrewInfo(Long crewId) {

        // 크루 정보 가져오기
        Crew crew = crewRepository.findById(crewId)
                .orElseThrow(()->new NotFoundCrewException(crewId));

        // 크루 인원 수 가져오기
        int crewCount = crewRepository.countMembersByCrewId(crewId);

        // 크루 정보
        return CrewInfoItem
                .builder()
                .crewId(crewId)
                .crewName(crew.getCrewName())
                .area(crew.getArea())
                .slogan(crew.getSlogan())
                .crewCount(crewCount)
                .captainName(crew.getCaptain().getName())
                .imageUrl(crew.getBanner())
                .introduction(crew.getIntroduction())
                .crewBirth(crew.getCrewBirth())
                .build();

    }

    // 크루 정보 수정
    public void updateCrewInfo(Long crewId, CreateCrewRequest createCrewRequest, CustomUser customUser) {
        Crew crew = crewRepository.findById(crewId).orElseThrow(()->new NotFoundCrewException(crewId));

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        Position position = memberCrewRepository.findPositionByMember(member, crewId).orElseThrow(CrewPositionMismatchException::new);

        // CAPTAIN 만 수정 가능
        if(position == Position.CAPTAIN) {
            crew.updateCrewInfo(createCrewRequest);
        } else {
            throw new CrewUnauthorizedException();
        }
    }

    // 크루 정보 삭제
    public void deleteCrewInfo(Long crewId, CustomUser customUser) {
        Crew crew = crewRepository.findById(crewId).orElseThrow(()->new NotFoundCrewException(crewId));

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        Position position = memberCrewRepository.findPositionByMember(member, crewId).orElseThrow(CrewPositionMismatchException::new);

        // CAPTAIN 만 삭제 가능
        if(position == Position.CAPTAIN) {
            // MemberCrew 먼저 삭제
            memberCrewRepository.deleteByCrewId(crewId);

            // Crew 삭제
            crewRepository.delete(crew);
        } else {
            throw new CrewUnauthorizedException();
        }
    }

    // 공지사항 조회
    public CrewNoticeItemResponse getCrewNoticeList(int pageNo, Long crewId, CustomUser customUser) {
        Pageable pageable = PageRequest.of(pageNo, 5); // pageNo 페이지 번호, 5 : 페이지 크기

        // 현재 사용자 정보 가져오기
        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        // 해당 멤버의 position
        Position position = memberCrewRepository.findPositionByMember(member, crewId).orElseThrow(CrewPositionMismatchException::new);

        Crew crew = crewRepository.findById(crewId).orElseThrow(()->new NotFoundCrewException(crewId));

        // 해당 크루의 공지사항 게시물 가져오기
        Page<Post> noticeListPage = postRepository.findByCrewIdAndPostType(crewId, PostType.NOTICE, pageable);
        List<Post> noticeList = noticeListPage.getContent();
        int lastPageNo = Math.max(noticeListPage.getTotalPages() - 1, 0);

        List<CrewResponse.CrewNoticeItem> crewNoticeItems = noticeList.stream().map(notice -> {
            return CrewResponse.CrewNoticeItem
                    .builder()
                    .position(position)
                    .title(notice.getTitle())
                    .createdAt(notice.getCreatedAt())
                    .updatedAt(notice.getUpdatedAt())
                    .noticeId(notice.getId())
                    .build();
        }).collect(Collectors.toList());

        return CrewNoticeItemResponse.builder()
                .crewNoticeList(crewNoticeItems)
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .build();
    }

    public CrewGalleryItemResponse getCrewGalleryList(int pageNo, Long crewId, CustomUser customUser) {
        Pageable pageable = PageRequest.of(pageNo, 27); // 페이지 크기 : 27

        // 해당 크루의 일반 게시물 가져오기
        Page<Post> galleryListPage = postRepository.findByCrewIdAndPostType(crewId, PostType.STANDARD, pageable);
        List<Post> galleryList = galleryListPage.getContent();
        int lastPageNo = Math.max(galleryListPage.getTotalPages() - 1, 0);

        List<CrewResponse.CrewGalleryItem> crewGalleryItems = galleryList.stream().map(post -> {
            return CrewResponse.CrewGalleryItem
                    .builder()
                    .postId(post.getId())
                    .imageUrls(post.getPostImages().stream().map(postImage ->
                        postImage.getImageUrl()
                    ).toList())
                    .build();
        }).collect(Collectors.toList());

        return CrewGalleryItemResponse
                .builder()
                .crewGalleryList(crewGalleryItems)
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .build();

    }

    public void updateNotice(Long noticeId, CreateCrewNoticeRequest createCrewNoticeRequest) {
        Post post = postRepository.findById(noticeId)
                .orElseThrow(() -> new NotFoundPostException(noticeId));
        post.updateCrewNotice(createCrewNoticeRequest);
    }

    public void deleteNotice(Long noticeId) {
        Post post = postRepository.findById(noticeId)
                .orElseThrow(() -> new NotFoundPostException(noticeId));
        postRepository.delete(post);
    }

    // 크루 권한 수정 (권한 부여)
    public void updateMemberCrewPosition(CrewRequest.UpdateCrewPositionRequest updateCrewPositionRequest, CustomUser customUser) {
        // 현재 사용자가 CAPTAIN 일때만 가능함 (Exception 처리 해주기)

        // 현재 사용자 정보 가져오기
        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        // 요청한 사람의 position
        Position position = memberCrewRepository.findPositionByMember(member, updateCrewPositionRequest.getCrewId()).orElseThrow(CrewUnauthorizedException::new);

        // 권한을 부여해야 할 사용자
        MemberCrew memberCrew = memberCrewRepository.findByMemberIdAndCrewId(updateCrewPositionRequest.getMemberId(), updateCrewPositionRequest.getCrewId()).orElseThrow(NotFoundMemberCrewException::new);

        // CAPTAIN 일때만
        if(position == Position.CAPTAIN) {
            // 권한 수정
            memberCrewRepository.updatePosition(memberCrew.getId(), updateCrewPositionRequest.getPosition());
        }else {
            throw new CrewUnauthorizedException();
        }
    }

    // 크루원 조회 (일반, 대기 중 List 나눠서)
    // 일반 : isJoined (true), isInvited (true)
    // 대기 중 : isJoined (false), isInvited (true)
    public CrewMemberItemResponse getCrewMemberList(Long crewId) {

        // 해당 크루에 있는 크루원 조회
        List<MemberCrew> memberCrewList = memberCrewRepository.findByCrewId(crewId);

        // 일반 회원 리스트
        List<CrewMemberItem> crewIsJoinedMemberList = new ArrayList<>();
        // 대기 중인 회원 리스트
        List<CrewMemberItem> crewIsInvitedMemberList = new ArrayList<>();

        // MemberCrew 객체를 CrewMemberItem 객체로 변환하고 리스트에 추가
        for (MemberCrew memberCrew : memberCrewList) {
            CrewMemberItem item = CrewMemberItem.builder()
                    .nickname(memberCrew.getMember().getNickname())
                    .name(memberCrew.getMember().getName())
                    .email(memberCrew.getMember().getEmail())
                    .isJoined(memberCrew.getIsJoined())
                    .isInvited(memberCrew.getIsInvited())
                    .position(memberCrew.getPosition())
                    .build();

            if (item.isJoined() && item.isInvited()) {
                crewIsJoinedMemberList.add(item);
            } else if (!item.isJoined() && item.isInvited()) {
                crewIsInvitedMemberList.add(item);
            }
        }

        // CrewMemberItemResponse 객체 생성 및 반환
        return CrewMemberItemResponse.builder()
                .crewIsJoinedMemberList(crewIsJoinedMemberList)
                .crewIsInvitedMemberList(crewIsInvitedMemberList)
                .build();

    }

    // 크루 초대
    public void inviteCrewMember(CustomUser customUser, CrewInvitedMemberRequest crewInvitedMemberRequest) {

        // 요청자 (crewId)
        Member member = memberRepository.findByEmail(customUser.getEmail()).orElseThrow(NotFoundMemberException::new);
        Crew crew = crewRepository.findById(crewInvitedMemberRequest.getCrewId()).orElseThrow(() -> new NotFoundCrewException(crewInvitedMemberRequest.getCrewId()));
        Position position = memberCrewRepository.findPositionByMember(member, crewInvitedMemberRequest.getCrewId()).orElseThrow(() -> new NotFoundCrewException(crewInvitedMemberRequest.getCrewId()));

        // 초대 당한 사람 (memberId)
        Member invitedMember = memberRepository.findById(crewInvitedMemberRequest.getMemberId()).orElseThrow(NotFoundMemberException::new);

        MemberCrew invitedMemberCrew = MemberCrew
                .builder()
                .member(invitedMember)
                .crew(crew)
                .position(Position.MEMBER)
                .isJoined(false)
                .isInvited(true)
                .build();

        if(position == Position.CAPTAIN) {
            // 초대 하면 회원 크루에 넣기 (이미 초대 요청이 보내진 멤버한테는 초대 요청을 보내면 안됨)
            Optional<MemberCrew> memberCrew = memberCrewRepository.findByMemberIdAndCrewId(crewInvitedMemberRequest.getMemberId(), crewInvitedMemberRequest.getCrewId());
            if(memberCrew.isEmpty()) { // memberCrew 에 없을 때만 요청 보내기
                memberCrewRepository.save(invitedMemberCrew);
            } else {
                // 이미 초대된 요청 입니다. Exception
                throw new CrewDupulicateException();
            }
        }else {
            throw new CrewUnauthorizedException(); // CAPTAIN 만 초대 가능
        }

    }

    // 크루 수락, 거절
    public void replyCrewInvitation(CustomUser customUser, CrewReplyMemberRequest crewReplyMemberRequest) {

        // 초대된 사람 (memberId)
        Member member = memberRepository.findByEmail(customUser.getEmail()).orElseThrow(NotFoundMemberException::new);
        if(!Objects.equals(member.getId(), crewReplyMemberRequest.getMemberId())) {
            throw new CrewMemberInvitedException();
        }

        // 초대한 사람 (어떤 크루 인지 crewId)
        Crew crew = crewRepository.findById(crewReplyMemberRequest.getCrewId()).orElseThrow(()-> new NotFoundCrewException(crewReplyMemberRequest.getCrewId()));

        MemberCrew memberCrew = memberCrewRepository.findByMemberIdAndCrewId(crewReplyMemberRequest.getMemberId(), crewReplyMemberRequest.getCrewId()).orElseThrow(NotFoundMemberCrewException::new);

        // 초대된 사람의 응답 (수락 or 거절)
        if(memberCrew.getPosition() == Position.MEMBER) {
            if(memberCrew.getIsInvited() && !memberCrew.getIsJoined()) { // isInvited는 true 이고, isJoined는 false인 상태면 초대 미수락 상태
                memberCrew.updateMemberCrewInvitation(crewReplyMemberRequest.getReplyStatus());
            }
        } else {
            throw new CrewUnauthorizedException(); // Member 일때만 가능 해야 함
        }

    }

}
