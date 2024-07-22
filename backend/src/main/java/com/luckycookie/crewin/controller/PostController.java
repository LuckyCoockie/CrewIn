package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.PostRequest;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.dto.PostResponse;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/post")
@Slf4j
public class PostController {
    private final PostService postService;

    @PostMapping()
    public ResponseEntity<BaseResponse<Void>> createPost(@AuthenticationPrincipal CustomUser customUser, @RequestBody PostRequest.WritePostRequest writePostRequest) {
        log.info("req: {}", writePostRequest.toString());
        postService.writePost(writePostRequest, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.CREATED.value(), "게시물을 등록하는데 성공했습니다."));
    }

    @GetMapping()
    public ResponseEntity<BaseResponse<List<PostResponse>>> getAllPostsSortedByCreatedAt() {
        List<PostResponse> posts = postService.getAllPostsSortedByCreatedAt();
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "게시물 리스트를 조회하는데 성공했습니다", posts));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> updatePost(
            @PathVariable("id") Long postId,
            @RequestBody PostRequest.UpdatePostRequest updatePostRequest) {
        try {
            postService.updatePost(postId, updatePostRequest);
            return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "게시물을 수정하는데 성공했습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(BaseResponse.create(HttpStatus.BAD_REQUEST.value(), "게시물 업데이트를 실패했습니다: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> deletePost(@PathVariable("id") Long postId) {
        try {
            postService.deletePost(postId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(BaseResponse.create(HttpStatus.BAD_REQUEST.value(), "게시물 삭제를 실패했습니다." + e.getMessage()));
        }
    }

}
