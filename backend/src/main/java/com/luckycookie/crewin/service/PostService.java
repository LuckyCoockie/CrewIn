package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.*;
import com.luckycookie.crewin.domain.enums.NotificationType;
import com.luckycookie.crewin.domain.enums.PostType;
import com.luckycookie.crewin.dto.PostRequest.UpdatePostRequest;
import com.luckycookie.crewin.dto.PostRequest.WritePostRequest;
import com.luckycookie.crewin.dto.PostResponse.PostGalleryItem;
import com.luckycookie.crewin.dto.PostResponse.PostItem;
import com.luckycookie.crewin.dto.base.PagingItemsResponse;
import com.luckycookie.crewin.exception.crew.NotFoundCrewException;
import com.luckycookie.crewin.exception.member.MemberNotFoundException;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.exception.memberCrew.NotFoundMemberCrewException;
import com.luckycookie.crewin.exception.post.NotFoundPostException;
import com.luckycookie.crewin.exception.post.UnauthorizedDeletionException;
import com.luckycookie.crewin.repository.*;
import com.luckycookie.crewin.security.dto.CustomUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PostService {
    private final PostRepository postRepository;
    private final MemberRepository memberRepository;
    private final CrewRepository crewRepository;
    private final HeartRepository heartRepository;
    private final PostImageRepository postImageRepository;
    private final MemberCrewRepository memberCrewRepository;

    private final NotificationService notificationService;

    public void writePost(WritePostRequest writePostRequest, CustomUser customUser) {

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        Crew crew = null;
        if (writePostRequest.getCrewId() != null && writePostRequest.getCrewId() != 0) {
            crew = crewRepository.findById(writePostRequest.getCrewId())
                    .orElseThrow(NotFoundCrewException::new);

            if (!memberCrewRepository.existsByMemberAndCrew(member, crew)) {
                throw new NotFoundMemberCrewException();
            }
        }

        Post post = Post.builder()
                .crew(crew)
                .author(member)
                .content(writePostRequest.getContent())
                .isPublic(writePostRequest.getIsPublic())
                .postType(PostType.STANDARD) // 문자열을 Enum으로 변환
                .build();

        postRepository.save(post);

        if (writePostRequest.getPostImages() != null) {
            for (String imageUrl : writePostRequest.getPostImages()) {
                PostImage postImage = PostImage.builder()
                        .post(post)
                        .imageUrl(imageUrl)
                        .build();
                postImageRepository.save(postImage);
            }
        }
    }

    public void updatePost(Long postId, UpdatePostRequest updatePostRequest, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(NotFoundPostException::new);
        if (!post.getAuthor().getEmail().equals(email)) {
            throw new UnauthorizedDeletionException();
        }
        if (!post.getIsPublic() && post.getCrew() == null) {
            throw new NotFoundCrewException();
        }
        post.updatePost(updatePostRequest);
    }

    public void deletePost(Long postId, String email) {
        Post post = postRepository.findById(postId).orElseThrow(NotFoundPostException::new);
        if (!post.getAuthor().getEmail().equals(email)) {
            throw new UnauthorizedDeletionException();
        }

        postRepository.delete(post);
    }

    @Transactional(readOnly = true)
    public PagingItemsResponse<PostItem> getAllPostsSortedByCreatedAt(String email, int pageNo) {
        PageRequest pageRequest = PageRequest.of(pageNo, 10);
        Member viewer = memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new);
        List<MemberCrew> crews = memberCrewRepository.findJoinedMemberCrewsByMember(viewer);
        Page<Post> postListPage = postRepository.findPublicPostsSortedByCreatedAt(
                crews.stream().map(mc -> mc.getCrew().getId()).collect(Collectors.toList()), pageRequest
        );

        List<Post> postList = postListPage.getContent();
        int lastPageNo = Math.max(postListPage.getTotalPages() - 1, 0);

        log.info("post : {}", postList.get(0).getContent());
        log.info("images : {}", postList.get(0).getPostImages().isEmpty());
        List<PostItem> postItems = postList.stream().map(post -> PostItem.builder()
                .id(post.getId())
                .authorName(post.getAuthor().getName())
                .authorId(post.getAuthor().getId())
                .content(post.getContent())
                .heartCount(post.getHearts().size())
                .isHearted(heartRepository.existsByPostAndMember(post, viewer))
                .isPublic(post.getIsPublic())
                .postType(post.getPostType())
                .postImages(post.getPostImages().stream().map(PostImage::getImageUrl).toList())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .title(post.getTitle())
                .build()).toList();

        return PagingItemsResponse.<PostItem>builder()
                .items(postItems)
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .build();
    }

    // 사진첩 조회
    public PagingItemsResponse<PostGalleryItem> getCrewPostGallery(int pageNo, long crewId, CustomUser customUser) {
        PageRequest pageRequest = PageRequest.of(pageNo, 27);
        Member viewer = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(MemberNotFoundException::new);
        Crew crew = crewRepository.findById(crewId)
                .orElseThrow(NotFoundCrewException::new);
        if (!memberCrewRepository.existsByMemberAndCrew(viewer, crew)) {
            throw new NotFoundMemberCrewException();
        }
        Page<Post> postListPage = postRepository.findByCrewAndPostType(crew, PostType.STANDARD, pageRequest);
        return convertToGalleryItemResponse(pageNo, postListPage);
    }

    public PagingItemsResponse<PostGalleryItem> getUserPostGallery(int pageNo, long targetMemgerId, CustomUser customUser) {
        PageRequest pageRequest = PageRequest.of(pageNo, 27);
        Member targetMember = memberRepository.findById(targetMemgerId)
                .orElseThrow(NotFoundMemberException::new);
        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(MemberNotFoundException::new);
        // 1. isPublic이 true인 글 (isPublic은 tinyInt형임) or
        // 2. 남(targetMember)이 작성한 게시글 중 크루가 null인(태그되지 않은)글 or
        // 3. 크루가 태그되었다면 해당 크루에 targetMember와 Member가 속해있는 글들

        Page<Post> postListPage = postRepository.findByMemberAndTargetMember(member, targetMember, pageRequest);
        return convertToGalleryItemResponse(pageNo, postListPage);
    }

    public PagingItemsResponse<PostGalleryItem> getMyPostGallery(int pageNo, CustomUser customUser) {
        PageRequest pageRequest = PageRequest.of(pageNo, 27);
        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(MemberNotFoundException::new);
        // 내가 작성한 게시글(type이 standard인 글 중 작성자가 본인인 글)
        Page<Post> postListPage = postRepository.findByMember(member, pageRequest);
        return convertToGalleryItemResponse(pageNo, postListPage);
    }

    // Page<Post>를 받아서 갤러리 response로 변환
    private PagingItemsResponse<PostGalleryItem> convertToGalleryItemResponse(int pageNo, Page<Post> postListPage) {
        List<Post> postList = postListPage.getContent();
        int lastPageNo = Math.max(postListPage.getTotalPages() - 1, 0);
        List<PostGalleryItem> postGalleryItems = postList.stream()
                .map(post -> new PostGalleryItem(
                        post.getId(),
                        post.getPostImages().isEmpty() ? null : post.getPostImages().get(0).getImageUrl()
                ))
                .toList();
        return PagingItemsResponse.<PostGalleryItem>builder()
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .items(postGalleryItems)
                .build();
    }

    // 사진첩 상세 조회
    // 크루
    public PagingItemsResponse<PostItem> getCrewPostGalleryDetailResponse(Long crewId, Long postId, String direction, CustomUser customUser) {
        // 현재 로그인한 사용자
        Member member = memberRepository.findByEmail(customUser.getEmail()).orElseThrow(NotFoundMemberException::new);
        Crew crew = crewRepository.findById(crewId).orElseThrow(NotFoundCrewException::new);

        // 현재 로그인한 사용자가 해당 crew 에 포함되어 있는지 확인
        memberCrewRepository.findByMemberAndCrew(member, crew).orElseThrow(NotFoundMemberCrewException::new);

        Page<Post> postListPage = null;
        PageRequest pageRequest = PageRequest.of(0, 10);

        // postId 기준으로 increase나 decrease에 따라 데이터 조회
        if (direction.equals("increase")) {
            // postId 보다 작은 포스트들을 가져옴
            postListPage = postRepository.findByCrewAndIdLessThanAndPostTypeOrderByIdAsc(crew, postId, PostType.STANDARD, pageRequest);
        } else if (direction.equals("decrease")) {
            // postId 보다 큰 포스트들을 가져옴
            postListPage = postRepository.findByCrewAndIdGreaterThanAndPostTypeOrderByIdAsc(crew, postId, PostType.STANDARD, pageRequest);
        }

        assert postListPage != null;
        return convertToPostItemsResponse(postListPage, customUser);
    }

    // 멤버
    public PagingItemsResponse<PostItem> getMemberPostGalleryDetailResponse(Long memberId, Long postId, String direction, CustomUser customUser) {
        // 현재 로그인한 사용자
        Member member = memberRepository.findByEmail(customUser.getEmail()).orElseThrow(NotFoundMemberException::new);

        Page<Post> postListPage = null;
        PageRequest pageRequest = PageRequest.of(0, 10);

        // 현재 로그인한 사용자와 memberId가 같은지 다른지 확인
        // 같으면 내 게시물 다르면 다른 사람 게시물
        if (Objects.equals(member.getId(), memberId)) { // 내 게시물
            if (direction.equals("increase")) {
                // Id 보다 큰 포스트들을 오름차순으로 가져옴
                postListPage = postRepository.findByAuthorAndIdGreaterThanAndPostTypeOrderByIdAsc(member, postId, PostType.STANDARD, pageRequest);
            } else if (direction.equals("decrease")) {
                // Id 보다 작은 포스트들을 내림차순으로 가져옴
                postListPage = postRepository.findByAuthorAndIdLessThanAndPostTypeOrderByIdAsc(member, postId, PostType.STANDARD, pageRequest);
            }
        } else { // 다른 사람 게시물
            Member otherMember = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);
            if (direction.equals("increase")) {
                // 다른 사람의 Id 보다 큰 포스트들을 오름차순으로 가져옴
                postListPage = postRepository.findByAuthorAndIdGreaterThanAndPostTypeOrderByIdAsc(otherMember, postId, PostType.STANDARD, pageRequest);
            } else if (direction.equals("decrease")) {
                // 다른 사람의 Id 보다 작은 포스트들을 내림차순으로 가져옴
                postListPage = postRepository.findByAuthorAndIdLessThanAndPostTypeOrderByIdAsc(otherMember, postId, PostType.STANDARD, pageRequest);
            }
        }

        assert postListPage != null;
        return convertToPostItemsResponse(postListPage, customUser);
    }

    // Page<Post> 받아서 상세조회 response 반환
    private PagingItemsResponse<PostItem> convertToPostItemsResponse(Page<Post> postListPage, CustomUser customUser) {
        /*
         * 1. 하트 테이블에서 게시글 번호로 하트 개수
         * 2. 하트 테이블에서 isHearted
         * */

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        List<PostItem> postList = postListPage.getContent()
                .stream()
                .map(post -> PostItem
                        .builder()
                        .id(post.getId())
                        .authorName(post.getAuthor().getName())
                        .authorId(post.getId())
                        .content(post.getContent())
                        .heartCount(post.getHearts().size())
                        .isPublic(post.getIsPublic())
                        .postType(post.getPostType())
                        .title(post.getTitle())
                        .isHearted(post.getHearts().stream().anyMatch(heart -> heart.getMember().getId().equals(member.getId())))
                        .profileImage(post.getAuthor().getImageUrl())
                        .createdAt(post.getCreatedAt())
                        .updatedAt(post.getUpdatedAt())
                        .postImages(post.getPostImages().stream().map(PostImage::getImageUrl).toList())
                        .build())
                .collect(Collectors.toList());

        return PagingItemsResponse
                .<PostItem>builder()
                .items(postList)
                .build();

    }

    public void registHeart(Long postId, CustomUser customUser) {

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Post post = postRepository.findById(postId)
                        .orElseThrow(NotFoundPostException::new);
        // 좋아요 등록
        heartRepository.save(Heart.builder().post(post).member(member).build());
        // 알림 생성
        notificationService.createNotification(NotificationType.LIKE, member.getId(), post.getAuthor().getId(), post.getId());
    }


}
