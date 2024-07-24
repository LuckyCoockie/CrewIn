package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.*;
import com.luckycookie.crewin.domain.enums.Position;
import com.luckycookie.crewin.domain.enums.PostType;
import com.luckycookie.crewin.dto.CrewRequest;
import com.luckycookie.crewin.dto.CrewResponse;
import com.luckycookie.crewin.dto.CrewResponse.CrewItem;
import com.luckycookie.crewin.dto.CrewResponse.CrewItemResponse;
import com.luckycookie.crewin.exception.crew.NotFoundCrewException;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.exception.post.NotFoundPostException;
import com.luckycookie.crewin.exception.crew.CrewPositionMismatchException;
import com.luckycookie.crewin.repository.*;
import com.luckycookie.crewin.security.dto.CustomUser;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

    public void createCrew(CrewRequest.CreateCrewRequest createCrewRequest, CustomUser customUser) {

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
    public CrewItemResponse getCrewList(int pageNo, CustomUser customUser) {
        Pageable pageable = PageRequest.of(pageNo, 10); // pageNo 페이지 번호, 10 : 페이지 크기

        Page<Crew> crewsPage;
        List<Crew> crews;
        int lastPageNo;

        // 사용자 정보 가져오기
        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        // 가입 여부 확인
        List<Integer> isJoinedList = memberCrewRepository.existsByMemberAndIsJoinedTrue(member);

        if (isJoinedList.contains(1)) {
            // 내가 가입되어 있는 크루
            crewsPage = crewRepository.findCrewsByMemberId(member.getId(), pageable);
        } else {
            // 모든 크루
            crewsPage = crewRepository.findAllByCrew(pageable);
        }

        crews = crewsPage.getContent();
        lastPageNo = Math.max(crewsPage.getTotalPages() - 1, 0);

        List<CrewItem> crewItems = crews.stream().map(crew -> {
            int crewCount = crewRepository.countMembersByCrewId(crew.getId());
            String captainName = crew.getCaptain().getName();

            return CrewItem.builder()
                    .id(crew.getId())
                    .name(crew.getCrewName())
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

    public void createCrewNotice(CrewRequest.CreateCrewNoticeRequest createCrewNoticeRequest, CustomUser customUser) {

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Crew crew = crewRepository.findById(createCrewNoticeRequest.getCrewId()).orElseThrow(NotFoundCrewException::new);

        // 크루 공지는 Pacer 이상
        Position position = memberCrewRepository.findPositionByMember(member).orElseThrow(CrewPositionMismatchException::new);

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
    public CrewResponse.CrewInfoItem getCrewInfo(Long crewId) {

        // 크루 정보 가져오기
        Crew crew = crewRepository.findById(crewId)
                .orElseThrow(NotFoundCrewException::new);

        // 크루 인원 수 가져오기
        int crewCount = crewRepository.countMembersByCrewId(crewId);

        // 크루 정보
        return CrewResponse.CrewInfoItem
                .builder()
                .id(crewId)
                .name(crew.getCrewName())
                .area(crew.getArea())
                .slogan(crew.getSlogan())
                .crewCount(crewCount)
                .captainName(crew.getCaptain().getName())
                .imageUrl(crew.getMainLogo())
                .infoText(crew.getIntroduction())
                .build();

    }

    // 공지사항 조회
    public CrewResponse.CrewNoticeItemResponse getCrewNoticeList(int pageNo, Long crewId, CustomUser customUser) {
        Pageable pageable = PageRequest.of(pageNo, 10); // pageNo 페이지 번호, 10 : 페이지 크기

        // 현재 사용자 정보 가져오기
        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        // 해당 멤버의 position
        Position position = memberCrewRepository.findPositionByMember(member).orElseThrow(CrewPositionMismatchException::new);

        Crew crew = crewRepository.findById(crewId).orElseThrow(NotFoundCrewException::new);

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

        return CrewResponse.CrewNoticeItemResponse.builder()
                .crewNoticeList(crewNoticeItems)
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .build();
    }

    public CrewResponse.CrewGalleryItemResponse getCrewGalleryList(int pageNo, Long crewId, CustomUser customUser) {
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

        return CrewResponse.CrewGalleryItemResponse
                .builder()
                .crewGalleryList(crewGalleryItems)
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .build();

    }

    public void updateNotice(Long noticeId, CrewRequest.CreateCrewNoticeRequest createCrewNoticeRequest) {
        Post post = postRepository.findById(noticeId)
                .orElseThrow(() -> new NotFoundPostException(noticeId));
        post.updateCrewNotice(createCrewNoticeRequest);
    }

    public boolean isJoined(Integer isJoined) {
        if (isJoined == null || isJoined == 0) {
            return false;
        } else {
            return true;
        }
    }

}
