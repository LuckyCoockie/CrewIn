package com.luckycookie.crewin.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.Headers;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.luckycookie.crewin.dto.ImageRequest.PresignedUrlReq;
import com.luckycookie.crewin.dto.ImageResponse.PresignedUrlRes;
import lombok.RequiredArgsConstructor;
import com.luckycookie.crewin.dto.ImageResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${image.prefix}")
    private String prefix;

    @Value("${image.folder}")
    private String folder;

    @Value("${image.excluded-urls}")
    private List<String> excludedImageUrls;

    // 발급
    @Transactional(readOnly = true)
    public ImageResponse.PresignedUrlRes issuePresignedUrl(PresignedUrlReq presignedUrlReq){

        String imageName = folder + UUID.randomUUID() + "." + presignedUrlReq.getImageExtension().getUploadExtension();

        GeneratePresignedUrlRequest request = generatePresignedUrlRequest(bucket, imageName);
        return PresignedUrlRes.builder()
                .presignedUrl(amazonS3.generatePresignedUrl(request).toString())
                .imageUrl(prefix + imageName)
                .build();
    }

    // 요청
    private GeneratePresignedUrlRequest generatePresignedUrlRequest(String bucket, String imageName) {
        // 만료 시간 설정
        Date expiration = new Date();
        long expTimeMillis = expiration.getTime();
        expTimeMillis += 1000 * 60 * 5; // 5분
        expiration.setTime(expTimeMillis);

        // Pre-Signed Url request 생성
        GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucket, imageName)
                .withMethod(HttpMethod.PUT)
                .withExpiration(expiration);

        // request 파라미터 추가
        request.addRequestParameter(
                Headers.S3_CANNED_ACL,
                CannedAccessControlList.PublicRead.toString());

        return request;
    }

    // S3 이미지 제거
    public void deleteImage(String imageUrl) {

        // 기본 이미지 URL 예외 처리
        if (excludedImageUrls.contains(imageUrl)) {
            // 기본 이미지는 삭제하지 않음
            return;
        }

        // 객체 키 추출
        String objectKey = extractObjectKeyFromUrl(imageUrl);

        // 객체 삭제
        amazonS3.deleteObject(new DeleteObjectRequest(bucket, objectKey));
    }

    private String extractObjectKeyFromUrl(String imageUrl) {
        // URL 에서 버킷 프리픽스 제거
        if (imageUrl.startsWith(prefix)) {
            return imageUrl.substring(prefix.length());
        }
        return imageUrl;
    }

}
