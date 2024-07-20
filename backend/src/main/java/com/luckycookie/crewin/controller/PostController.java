package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.PostRequest;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.dto.PostResponse;
import com.luckycookie.crewin.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/post")
public class PostController {
    private final PostService postService;

    @PostMapping()
    public ResponseEntity<BaseResponse<Void>> createPost(@RequestBody PostRequest.WritePostRequest writePostRequest) {
        postService.writePost(writePostRequest);
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

}
