package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.*;
import com.luckycookie.crewin.domain.enums.PostType;
import com.luckycookie.crewin.dto.PostRequest;
import com.luckycookie.crewin.dto.PostResponse;
import com.luckycookie.crewin.exception.crew.NotFoundCrewException;
import com.luckycookie.crewin.exception.member.MemberNotFoundException;
import com.luckycookie.crewin.exception.member.NotFoundMemberException;
import com.luckycookie.crewin.exception.post.NotFoundPostException;
import com.luckycookie.crewin.repository.*;
import com.luckycookie.crewin.security.dto.CustomUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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

        Crew crew = crewRepository.findById(writePostRequest.getCrewId())
                .orElseThrow(NotFoundCrewException::new);

        Post post = Post.builder()
                .crew(crew)
                .author(member)
                .content(writePostRequest.getContent())
                .isPublic(writePostRequest.getIsPublic())
                .postType(PostType.valueOf(writePostRequest.getPostType())) // 문자열을 Enum으로 변환
                .title(writePostRequest.getTitle())
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
    public List<PostResponse> getAllPostsSortedByCreatedAt(String email) {
        Member viewer = memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new);
        List<MemberCrew> crews = memberCrewRepository.findJoinedMemberCrewsByMember(viewer);
        List<Post> posts = postRepository.findPublicPostsSortedByCreatedAt(
                crews.stream().map(mc -> mc.getCrew().getId()).collect(Collectors.toList())
        );
        return posts.stream().map(p -> convertToDto(p, viewer.getId())).collect(Collectors.toList());
    }

    private PostResponse convertToDto(Post post, Long viewerId) {
        int heartCount = heartRepository.countByPostId(post.getId());
        List<String> postImages = getPostImages(post.getId());

        Long authorId;
        String authorName;
        if (post.getPostType() == PostType.NOTICE) {
            authorId = post.getAuthor().getId();
            authorName = post.getAuthor().getName();
        } else {
            authorId = post.getCrew().getId();
            authorName = post.getCrew().getCrewName();
        }

        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .authorId(authorId)
                .authorName(authorName)
                .heartCount(heartCount)
                .isPublic(post.getIsPublic())
                .postType(post.getPostType())
                .title(post.getTitle())
                .isHearted(heartRepository.existsByPostIdAndMemberId(post.getId(), viewerId))
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .postImages(postImages).build();
    }

    private List<String> getPostImages(Long postId) {
        List<PostImage> postImages = postImageRepository.findByPostId(postId);
        return postImages.stream().map(PostImage::getImageUrl).toList();
    }
}
