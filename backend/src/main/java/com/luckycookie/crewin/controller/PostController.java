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
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "게시물을 등록하는데 성공했습니다."));
    }

    @GetMapping()
    public ResponseEntity<BaseResponse<List<PostResponse>>> getAllPostsSortedByCreatedAt() {
        List<PostResponse> posts = postService.getAllPostsSortedByCreatedAt();
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "게시물 리스트를 조회하는데 성공했습니다", posts));
    }
}
