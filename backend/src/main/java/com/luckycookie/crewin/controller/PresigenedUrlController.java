package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.ImageRes;
import com.luckycookie.crewin.dto.ImageReq.PresignedUrlReq;
import com.luckycookie.crewin.dto.base.BaseRes;
import com.luckycookie.crewin.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/presigned")
public class PresigenedUrlController {

    private final S3Service s3Service;

    @PostMapping()
    public ResponseEntity<BaseRes<ImageRes.PresignedUrlRes>> uploadImage(@RequestBody PresignedUrlReq presignedUrlReq) {
        return ResponseEntity.ok(BaseRes.create(HttpStatus.OK.value(), "presignedUrl 생성에 성공했습니다.", s3Service.issuePresignedUrl(presignedUrlReq)));
    }

}
