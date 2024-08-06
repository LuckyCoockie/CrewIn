package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.CrewResponse;
import com.luckycookie.crewin.dto.PostRequest;
import com.luckycookie.crewin.dto.PostResponse;
import com.luckycookie.crewin.dto.PostResponse.PostGalleryItem;
import com.luckycookie.crewin.dto.PostResponse.PostItem;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.dto.base.PagingItemsResponse;
import com.luckycookie.crewin.exception.post.ImageRequiredException;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/post")
@Slf4j
public class PostController {

    private final PostService postService;

    @PostMapping()
    public ResponseEntity<BaseResponse<Void>> createPost(@AuthenticationPrincipal CustomUser customUser, @RequestBody PostRequest.WritePostRequest writePostRequest) {
        if (writePostRequest.getPostImages().isEmpty()) {
            throw new ImageRequiredException();
        }
        postService.writePost(writePostRequest, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.CREATED.value(), "게시물을 등록하는데 성공했습니다."));
    }

    @GetMapping("/home")
    public ResponseEntity<BaseResponse<PagingItemsResponse<PostItem>>> getAllPosts(@AuthenticationPrincipal CustomUser customUser, @RequestParam("page-no") Integer pageNo) {
        PagingItemsResponse<PostItem> postItemsResponse = postService.getAllPostsSortedByCreatedAt(customUser.getEmail(), pageNo);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "게시물 리스트를 조회하는데 성공했습니다", postItemsResponse));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> updatePost(
            @PathVariable("id") Long postId,
            @RequestBody PostRequest.UpdatePostRequest updatePostRequest,
            @AuthenticationPrincipal CustomUser customUser) {
        try {
            postService.updatePost(postId, updatePostRequest, customUser.getEmail());
            return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "게시물을 수정하는데 성공했습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(BaseResponse.create(HttpStatus.BAD_REQUEST.value(), "게시물 업데이트를 실패했습니다: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> deletePost(@PathVariable("id") Long postId, @AuthenticationPrincipal CustomUser customUser) {
        try {
            postService.deletePost(postId, customUser.getEmail());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(BaseResponse.create(HttpStatus.BAD_REQUEST.value(), "게시물 삭제를 실패했습니다." + e.getMessage()));
        }
    }

    // 사진첩 조회
    // 크루 사진첩(갤러리) 조회 - 페이징
    @GetMapping("/crew/gallery/{crew-id}")
    public ResponseEntity<BaseResponse<PagingItemsResponse<PostGalleryItem>>> getCrewGalleryList(@AuthenticationPrincipal CustomUser customUser, @PathVariable("crew-id") Long crewId, @RequestParam("page-no") int pageNo) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루 사진첩 조회를 성공했습니다.", postService.getCrewPostGallery(pageNo, crewId, customUser)));
    }

    // 멤버 사진첩(갤러리) 조회 - 페이징
    @GetMapping("/member/gallery/{member-id}")
    public ResponseEntity<BaseResponse<PagingItemsResponse<PostGalleryItem>>> getMemberGalleryList(@AuthenticationPrincipal CustomUser customUser, @PathVariable("member-id") Long memberId, @RequestParam("page-no") int pageNo) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "멤버 사진첩 조회를 성공했습니다.", postService.getUserPostGallery(pageNo, memberId, customUser)));
    }

    // 사진첩 상세 조회
    // 크루 사진첩 상세 조회
    @GetMapping("/crew/gallery/detail/{crew-id}")
    public ResponseEntity<BaseResponse<PagingItemsResponse<PostItem>>> getCrewGalleryDetailList(@AuthenticationPrincipal CustomUser customUser, @PathVariable("crew-id") Long crewId, @RequestParam("post-id") Long postId, @RequestParam String direction) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루 사진첩 상세 조회를 성공했습니다.", postService.getCrewPostGalleryDetailResponse(crewId, postId, direction, customUser)));
    }

    // 멤버 사진첩 상세 조회
    @GetMapping("/member/gallery/detail/{member-id}")
    public ResponseEntity<BaseResponse<PagingItemsResponse<PostItem>>> getMemberGalleryDetailList(@AuthenticationPrincipal CustomUser customUser, @PathVariable("member-id") Long memberId, @RequestParam("post-id") Long postId, @RequestParam String direction) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "멤버 사진첩 상세 조회를 성공했습니다.", postService.getMemberPostGalleryDetailResponse(memberId, postId, direction, customUser)));
    }

}
