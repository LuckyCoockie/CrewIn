package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.*;
import com.luckycookie.crewin.domain.enums.NotificationType;
import com.luckycookie.crewin.domain.enums.PostType;
import com.luckycookie.crewin.dto.PostRequest.UpdateCommentRequest;
import com.luckycookie.crewin.dto.PostRequest.UpdatePostRequest;
import com.luckycookie.crewin.dto.PostRequest.WriteCommentRequest;
import com.luckycookie.crewin.dto.PostRequest.WritePostRequest;
import com.luckycookie.crewin.dto.PostResponse.CommentItem;
import com.luckycookie.crewin.dto.PostResponse.PostGalleryItem;
import com.luckycookie.crewin.dto.PostResponse.PostItem;
import com.luckycookie.crewin.dto.base.PagingItemsResponse;
import com.luckycookie.crewin.exception.comment.NotFoundCommentException;
import com.luckycookie.crewin.exception.comment.NotMatchCommentMemberException;
import com.luckycookie.crewin.exception.crew.NotFoundCrewException;
import com.luckycookie.crewin.exception.heart.AlreadyExsistHeartException;
import com.luckycookie.crewin.exception.heart.NotFoundHeartException;
import com.luckycookie.crewin.exception.member.MemberNotFoundException;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.exception.memberCrew.NotFoundMemberCrewException;
import com.luckycookie.crewin.exception.post.ImageRequiredException;
import com.luckycookie.crewin.exception.post.InvalidPostException;
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

import java.util.Comparator;
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
    private final CommentRepository commentRepository;
    private final MemberCrewRepository memberCrewRepository;
    private final NotificationService notificationService;
    private final ValidationService validationService;
    private final S3Service s3Service;

    public void writePost(WritePostRequest writePostRequest, CustomUser customUser) {
        Member member = memberRepository.findFirstByEmail(customUser.getEmail())
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
        if (updatePostRequest.getPostImages().isEmpty()) {
            throw new ImageRequiredException();
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(NotFoundPostException::new);

        if (!post.getAuthor().getEmail().equals(email)) {
            throw new UnauthorizedDeletionException();
        }
        if (!post.getIsPublic() && post.getCrew() == null) {
            throw new NotFoundCrewException();
        }

        if (post.getPostType() == PostType.NOTICE && updatePostRequest.getIsPublic()) {
            throw new InvalidPostException();
        }

        post.updatePost(updatePostRequest);
    }

    public void deletePost(Long postId, String email) {

        Post post = postRepository.findById(postId)
                .orElseThrow(NotFoundPostException::new);

        // 기존 이미지 URL 리스트 가져오기
        List<String> postImageUrls = post.getPostImages().stream()
                .map(PostImage::getImageUrl)
                .toList();

        // 기존 이미지 삭제
        for (String imageUrl : postImageUrls) {
            s3Service.deleteImage(imageUrl);
        }

        if (!post.getAuthor().getEmail().equals(email)) {
            throw new UnauthorizedDeletionException();
        }

        postRepository.delete(post);

    }

    @Transactional(readOnly = true)
    public PostItem getPostDetail(Long postId, CustomUser customUser){
        Member viewer = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Post post = postRepository.findById(postId)
                .orElseThrow(NotFoundPostException::new);

        // 댓글 조회 및 DTO 변환
        List<CommentItem> comments = commentRepository.findByPostOrderByIdDesc(post).stream()
                .map(comment -> CommentItem.builder()
                        .id(comment.getId())
                        .authorId(comment.getMember().getId())
                        .authorName(comment.getMember().getNickname())
                        .content(comment.getContent())
                        .createdAt(comment.getCreatedAt())
                        .updatedAt(comment.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());


        //크루 공지글인 경우
        if (post.getPostType().equals(PostType.NOTICE)) {
            Crew crew = crewRepository.findById(post.getCrew().getId())
                    .orElseThrow(NotFoundCrewException::new);
            if (!memberCrewRepository.existsByMemberAndCrew(viewer, crew)) {
                throw new NotFoundMemberCrewException();
            }
            return PostItem.builder()
                    .id(postId)
                    .authorId(post.getCrew().getId())
                    .authorName(post.getCrew().getCrewName())
                    .content(post.getContent())
                    .heartCount(post.getHearts().size())
                    .isHearted(heartRepository.existsByPostAndMember(post, viewer))
                    .isPublic(post.getIsPublic())
                    .postType(post.getPostType())
                    .profileImage(post.getCrew().getMainLogo())
                    .postImages(post.getPostImages().stream().map(PostImage::getImageUrl).toList())
                    .title(post.getTitle())
                    .createdAt(post.getCreatedAt())
                    .updatedAt(post.getUpdatedAt())
                    .comments(comments)
                    .build();
        }
        if (!post.getIsPublic()) {
            if (post.getCrew() == null) {
                throw new InvalidPostException();
            }
            Crew crew = crewRepository.findById(post.getCrew().getId())
                    .orElseThrow(NotFoundCrewException::new);
            if (!memberCrewRepository.existsByMemberAndCrew(viewer, crew)) {
                throw new NotFoundMemberCrewException();
            }
        }
        //일반 게시글인 경우
        return PostItem.builder()
                .id(postId)
                .authorId(post.getAuthor().getId())
                .authorName(post.getAuthor().getNickname())
                .content(post.getContent())
                .heartCount(post.getHearts().size())
                .isHearted(heartRepository.existsByPostAndMember(post, viewer))
                .isPublic(post.getIsPublic())
                .postType(post.getPostType())
                .profileImage(post.getAuthor().getImageUrl())
                .postImages(post.getPostImages().stream().map(PostImage::getImageUrl).toList())
                .title(post.getTitle())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .comments(comments)
                .build();



    }

    @Transactional(readOnly = true)
    public PagingItemsResponse<PostItem> getAllPostsSortedByCreatedAt(String email, int pageNo) {
        PageRequest pageRequest = PageRequest.of(pageNo, 10);
        Member viewer = memberRepository.findFirstByEmail(email).orElseThrow(MemberNotFoundException::new);
        List<MemberCrew> crews = memberCrewRepository.findJoinedMemberCrewsByMember(viewer);
        Page<Post> postListPage = postRepository.findPublicPostsSortedByCreatedAt(
                crews.stream().map(mc -> mc.getCrew().getId()).collect(Collectors.toList()), pageRequest
        );

        List<Post> postList = postListPage.getContent();
        int lastPageNo = Math.max(postListPage.getTotalPages() - 1, 0);

        log.info("post : {}", postList.get(0).getContent());
        log.info("images : {}", postList.get(0).getPostImages().isEmpty());
        List<PostItem> postItems = postList.stream().map(post -> {
            String authNickName;
            String authProfile;
            Long authorId;
            if (PostType.NOTICE == post.getPostType()) {
                authProfile = post.getCrew().getMainLogo();
                authNickName = post.getCrew().getCrewName();
                authorId = post.getCrew().getId();
            } else {
                authProfile = post.getAuthor().getImageUrl();
                authNickName = post.getAuthor().getNickname();
                authorId = post.getAuthor().getId();
            }


            // 댓글 조회 및 DTO 변환
            List<CommentItem> comments = commentRepository.findByPostOrderByIdDesc(post).stream()
                    .map(comment -> CommentItem.builder()
                            .id(comment.getId())
                            .authorId(comment.getMember().getId())
                            .authorName(comment.getMember().getNickname())
                            .content(comment.getContent())
                            .createdAt(comment.getCreatedAt())
                            .updatedAt(comment.getUpdatedAt())
                            .build())
                    .collect(Collectors.toList());

            return PostItem.builder()
                    .id(post.getId())
                    .authorName(authNickName)
                    .authorId(authorId)
                    .content(post.getContent())
                    .heartCount(post.getHearts().size())
                    .isHearted(heartRepository.existsByPostAndMember(post, viewer))
                    .isPublic(post.getIsPublic())
                    .postType(post.getPostType())
                    .profileImage(authProfile)
                    .postImages(post.getPostImages().stream()
                            .sorted(Comparator.comparing(PostImage::getId))
                            .map(PostImage::getImageUrl)
                            .toList())
                    .createdAt(post.getCreatedAt())
                    .updatedAt(post.getUpdatedAt())
                    .title(post.getTitle())
                    .comments(comments)
                    .build();
        }).toList();

        return PagingItemsResponse.<PostItem>builder()
                .items(postItems)
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .build();
    }

    // 사진첩 조회
    public PagingItemsResponse<PostGalleryItem> getCrewPostGallery(int pageNo, long crewId, CustomUser customUser) {
        PageRequest pageRequest = PageRequest.of(pageNo, 12);
        Member viewer = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(MemberNotFoundException::new);
        Crew crew = crewRepository.findById(crewId)
                .orElseThrow(NotFoundCrewException::new);
        if (!memberCrewRepository.existsByMemberAndCrew(viewer, crew)) {
            throw new NotFoundMemberCrewException();
        }
        Page<Post> postListPage = postRepository.findByCrewAndPostType(crew, PostType.STANDARD, pageRequest);
        return convertToGalleryItemResponse(pageNo, postListPage);
    }

    public PagingItemsResponse<PostGalleryItem> getUserPostGallery(int pageNo, long targetMemberId, CustomUser customUser) {
        PageRequest pageRequest = PageRequest.of(pageNo, 12);
        Member targetMember = memberRepository.findById(targetMemberId)
                .orElseThrow(NotFoundMemberException::new);
        Member member = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(MemberNotFoundException::new);

        Page<Post> postListPage = null;

        if (member.getId() == targetMemberId) {
            postListPage = postRepository.findByMember(member, pageRequest);
        } else {
            // 1. isPublic이 true인 글 (isPublic은 tinyInt형임) or
            // 2. 크루가 태그되었다면 해당 크루에 targetMember와 Member가 속해있는 글들
            postListPage = postRepository.findByMemberAndTargetMember(member, targetMember, pageRequest);
        }

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
    public PagingItemsResponse<PostItem> getCrewPostGalleryDetailResponse(Long crewId, int pageNo, CustomUser customUser) {
        // 현재 로그인한 사용자
        Member member = memberRepository.findFirstByEmail(customUser.getEmail()).orElseThrow(NotFoundMemberException::new);
        Crew crew = crewRepository.findById(crewId).orElseThrow(NotFoundCrewException::new);

        // 현재 로그인한 사용자가 해당 crew 에 포함되어 있는지 확인
        memberCrewRepository.findByMemberAndCrew(member, crew).orElseThrow(NotFoundMemberCrewException::new);

        PageRequest pageRequest = PageRequest.of(pageNo, 12);
        Page<Post> postListPage = postRepository.findByCrewAndPostTypeOrderByIdDesc(crew, PostType.STANDARD, pageRequest);

        return convertToPostItemsResponse(postListPage, customUser);
    }

    // 멤버
    public PagingItemsResponse<PostItem> getMemberPostGalleryDetailResponse(Long memberId, int pageNo, CustomUser customUser) {
        // 현재 로그인한 사용자
        Member member = memberRepository.findFirstByEmail(customUser.getEmail()).orElseThrow(NotFoundMemberException::new);

        Page<Post> postListPage = null;
        PageRequest pageRequest = PageRequest.of(pageNo, 12);

        // 현재 로그인한 사용자와 memberId가 같은지 다른지 확인
        // 같으면 내 게시물 다르면 다른 사람 게시물
        if (Objects.equals(member.getId(), memberId)) { // 내 게시물
            postListPage = postRepository.findByMember(member, pageRequest);
        } else { // 다른 사람 게시물
            Member otherMember = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);
            postListPage = postRepository.findByMemberAndTargetMember(member, otherMember, pageRequest);
        }

        return convertToPostItemsResponse(postListPage, customUser);
    }

    // Page<Post> 받아서 상세조회 response 반환
    private PagingItemsResponse<PostItem> convertToPostItemsResponse(Page<Post> postListPage, CustomUser customUser) {

        Member member = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        List<PostItem> postList = postListPage.getContent()
                .stream()
                .map(post -> {
                    // 댓글 조회 및 DTO 변환
                    List<CommentItem> comments = commentRepository.findByPostOrderByIdDesc(post).stream()
                            .map(comment -> CommentItem.builder()
                                    .id(comment.getId())
                                    .authorId(comment.getMember().getId())
                                    .authorName(comment.getMember().getNickname())
                                    .content(comment.getContent())
                                    .createdAt(comment.getCreatedAt())
                                    .updatedAt(comment.getUpdatedAt())
                                    .build())
                            .collect(Collectors.toList());

                    return PostItem
                            .builder()
                            .id(post.getId())
                            .authorName(post.getAuthor().getNickname())
                            .authorId(post.getAuthor().getId())
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
                            .comments(comments) // 댓글 정보 추가
                            .build();
                })
                .collect(Collectors.toList());

        return PagingItemsResponse
                .<PostItem>builder()
                .items(postList)
                .build();
    }

    public void registHeart(Long postId, CustomUser customUser) {
        Member member = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Post post = postRepository.findById(postId)
                .orElseThrow(NotFoundPostException::new);
        if (heartRepository.existsByPostAndMember(post, member)) {
            // 이미 좋아요 눌려있는 게시글일때 요청 시 예외 처리
            throw new AlreadyExsistHeartException();
        } else {
            // 좋아요 등록
            heartRepository.save(Heart.builder().post(post).member(member).build());
            // 알림 생성
            notificationService.createNotification(NotificationType.LIKE, member.getId(), post.getAuthor().getId(), post.getId());
        }
    }

    public void deleteHeart(Long postId, CustomUser customUser) {

        Member member = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);
        Post post = postRepository.findById(postId)
                .orElseThrow(NotFoundPostException::new);
        Heart heart = heartRepository.findByMemberAndPost(member, post)
                .orElseThrow(NotFoundHeartException::new);
        // 좋아요 삭제
        heartRepository.delete(heart);
        // 알림 제거
        notificationService.deleteNotificationByPostId(member.getId(), post.getAuthor().getId(), postId);
    }

    public void writeComment(WriteCommentRequest writeCommentRequest, CustomUser customUser) {
        Member member = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        //댓글 길이 256자 이내 검증
        validationService.validateLength(writeCommentRequest.getContent(), 256);

        Post post = postRepository.findById(writeCommentRequest.getPostId())
                .orElseThrow(NotFoundPostException::new);

        Comment comment = Comment.builder()
                .member(member)
                .post(post)
                .content(writeCommentRequest.getContent())
                .build();
        commentRepository.save(comment);
    }

    public void updateComment(Long commentId, UpdateCommentRequest updateCommentRequest, CustomUser customUser) {
        Member member = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        postRepository.findById(updateCommentRequest.getPostId())
                .orElseThrow(NotFoundPostException::new);

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(NotFoundCommentException::new);

        //댓글 길이 256자 이내 검증
        validationService.validateLength(updateCommentRequest.getContent(), 256);

        if (!comment.getMember().getId().equals(member.getId())) {
            throw new NotMatchCommentMemberException();
        }
        comment.updateComment(updateCommentRequest.getContent());
        commentRepository.save(comment);
    }

    public void deleteComment(Long commentId, CustomUser customUser) {
        Member member = memberRepository.findFirstByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(NotFoundCommentException::new);

        if (!comment.getMember().getId().equals(member.getId())) {
            throw new NotMatchCommentMemberException();
        }

        commentRepository.delete(comment);
    }


}

