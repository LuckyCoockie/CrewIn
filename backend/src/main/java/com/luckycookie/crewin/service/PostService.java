package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.*;
import com.luckycookie.crewin.domain.enums.PostType;
import com.luckycookie.crewin.dto.PostRequest;
import com.luckycookie.crewin.dto.PostResponse.PostItem;
import com.luckycookie.crewin.dto.PostResponse.PostItemsResponse;
import com.luckycookie.crewin.exception.crew.NotFoundCrewException;
import com.luckycookie.crewin.exception.member.MemberNotFoundException;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.exception.memberCrew.NotFoundMemberCrewException;
import com.luckycookie.crewin.exception.post.NotFoundPostException;
import com.luckycookie.crewin.repository.*;
import com.luckycookie.crewin.security.dto.CustomUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

    public void writePost(PostRequest.WritePostRequest writePostRequest, CustomUser customUser) {

        Member member = memberRepository.findByEmail(customUser.getEmail())
                .orElseThrow(NotFoundMemberException::new);

        Crew crew = null;
        if (writePostRequest.getCrewId() != null) {
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

    public void updatePost(Long postId, PostRequest.UpdatePostRequest updatePostRequest) {
        Post post = postRepository.findById(postId)
                .orElseThrow(NotFoundPostException::new);
        post.updatePost(updatePostRequest);
    }

    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(NotFoundPostException::new);
        postRepository.delete(post);

    }

    @Transactional(readOnly = true)
    public PostItemsResponse getAllPostsSortedByCreatedAt(String email, int pageNo) {
        PageRequest pageRequest = PageRequest.of(pageNo, 10);
        Member viewer = memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new);
        List<MemberCrew> crews = memberCrewRepository.findJoinedMemberCrewsByMember(viewer);
        log.info("pageNo: {}", pageNo);
        log.info("page: {}", pageRequest);
        Page<Post> postListPage = postRepository.findPublicPostsSortedByCreatedAt(
                crews.stream().map(mc -> mc.getCrew().getId()).collect(Collectors.toList()), pageRequest
        );

        List<Post> postList = postListPage.getContent();
        int lastPageNo = Math.max(postListPage.getTotalPages() - 1, 0);

        List<PostItem> postItems = postList.stream().map(post -> PostItem.builder()
                .id(post.getId())
                .authorName(post.getAuthor().getName())
                .authorId(post.getAuthor().getId())
                .content(post.getContent())
                .heartCount(post.getHearts().size())
                .isHearted(heartRepository.existsByPostAndMember(post, viewer))
                .isPublic(post.getIsPublic())
                .postType(post.getPostType())
                .title(post.getTitle())
                .build()).toList();

        return PostItemsResponse.builder()
                .postItemList(postItems)
                .pageNo(pageNo)
                .lastPageNo(lastPageNo)
                .build();
    }

    private List<String> getPostImages(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(NotFoundPostException::new);

        List<PostImage> postImages = postImageRepository.findByPost(post);
        return postImages.stream().map(PostImage::getImageUrl).toList();
    }
}
