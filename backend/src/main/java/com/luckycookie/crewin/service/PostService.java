package com.luckycookie.crewin.service;

import com.luckycookie.crewin.domain.Crew;
import com.luckycookie.crewin.domain.Member;
import com.luckycookie.crewin.domain.Post;
import com.luckycookie.crewin.domain.PostImage;
import com.luckycookie.crewin.domain.enums.PostType;
import com.luckycookie.crewin.dto.PostRequest;
import com.luckycookie.crewin.dto.PostResponse;
import com.luckycookie.crewin.exception.crew.NotFoundCrewException;
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
                .orElseThrow(() -> new NotFoundPostException(postId));
        post.updatePost(updatePostRequest);
    }

    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundPostException(postId));
        postRepository.delete(post);

    }

    @Transactional(readOnly = true)
    public List<PostResponse> getAllPostsSortedByCreatedAt() {
        List<Post> posts = postRepository.findAllWithCrewAndAuthorByOrderByCreatedAtDesc();
        return posts.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private PostResponse convertToDto(Post post) {
        int heartCount = heartRepository.countByPostId(post.getId());
        List<String> postImages = getPostImages(post.getId());

        return PostResponse.builder()
                .id(post.getId())
                .crewName(post.getCrew().getCrewName())
                .authorEmail(post.getAuthor().getEmail())
                .content(post.getContent())
                .heartCount(heartCount)
                .isPublic(post.getIsPublic())
                .postType(post.getPostType())
                .title(post.getTitle())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .postImages(postImages)
                .build();
    }

    private List<String> getPostImages(Long postId) {
        List<PostImage> postImages = postImageRepository.findByPostId(postId);
        return postImages.stream().map(PostImage::getImageUrl).toList();
    }
}
