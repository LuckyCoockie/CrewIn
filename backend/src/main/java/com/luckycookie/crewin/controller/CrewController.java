package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.CrewRequest;
import com.luckycookie.crewin.dto.CrewRequest.CrewMemberRequest;
import com.luckycookie.crewin.dto.CrewRequest.CrewReplyMemberRequest;
import com.luckycookie.crewin.dto.CrewRequest.UpdateCrewPositionRequest;
import com.luckycookie.crewin.dto.CrewResponse;
import com.luckycookie.crewin.dto.CrewResponse.CrewItemResponse;
import com.luckycookie.crewin.dto.PostResponse;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.CrewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/crew")
@Slf4j
public class CrewController {

    private final CrewService crewService;

    // 크루 생성
    @PostMapping()
    public ResponseEntity<BaseResponse<CrewResponse.CrewCreateResponse>> createCrew(@AuthenticationPrincipal CustomUser customUser, @RequestBody CrewRequest.CreateCrewRequest createCrewRequest) {
        CrewResponse.CrewCreateResponse crewResponse = CrewResponse.CrewCreateResponse.builder()
                .crewId(crewService.createCrew(createCrewRequest, customUser).getId())
                .build();
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루를 생성하는데 성공했습니다.", crewResponse));
    }

    // 전체 크루 조회 (크루 없는 사람)
    @GetMapping()
    public ResponseEntity<BaseResponse<CrewItemResponse>> getAllCrewList(@RequestParam("page-no") int pageNo) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "전체 크루 목록 조회를 성공했습니다.", crewService.getAllCrewList(pageNo)));
    }

    // 내가 속한 크루 조회 (크루원 / 비크루원)
    @GetMapping("/my-crew")
    public ResponseEntity<BaseResponse<CrewResponse.MyCrewItemResponse>> getMyCrewList(@AuthenticationPrincipal CustomUser customUser) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "내가 속한 크루 목록 조회를 성공했습니다.", crewService.getMyCrewList(customUser)));
    }

    // 크루 공지 생성
    @PostMapping("/notice")
    public ResponseEntity<BaseResponse<Void>> createCrewNotice(@AuthenticationPrincipal CustomUser customUser, @RequestBody CrewRequest.CreateCrewNoticeRequest createCrewNoticeRequest) {
        crewService.createCrewNotice(createCrewNoticeRequest, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루 공지를 생성하는데 성공했습니다."));
    }

    // 크루 정보 조회
    @GetMapping("/detail/{crew-id}")
    public ResponseEntity<BaseResponse<CrewResponse.CrewInfoItem>> getCrewDetailInfo(@PathVariable("crew-id") Long crewId) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루 정보 조회를 성공했습니다.", crewService.getCrewInfo(crewId)));
    }

    // 크루 정보 수정
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> updateCrewInfo(
            @PathVariable("id") Long crewId,
            @RequestBody CrewRequest.CreateCrewRequest createCrewRequest, @AuthenticationPrincipal CustomUser customUser) {
        try {
            crewService.updateCrewInfo(crewId, createCrewRequest, customUser);
            return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루 정보를 수정하는데 성공했습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(BaseResponse.create(HttpStatus.BAD_REQUEST.value(), "크루 정보 업데이트를 실패했습니다: " + e.getMessage()));
        }
    }

    // 크루 정보 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> deleteCrew(@PathVariable("id") Long crewId, @AuthenticationPrincipal CustomUser customUser) {
        try {
            crewService.deleteCrewInfo(crewId, customUser);
            return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루 정보를 삭제하는데 성공했습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(BaseResponse.create(HttpStatus.BAD_REQUEST.value(), "크루 정보 삭제를 실패했습니다: " + e.getMessage()));
        }
    }

    // 크루 공지 조회
    @GetMapping("/notice/{crew-id}")
    public ResponseEntity<BaseResponse<CrewResponse.CrewNoticeItemResponse>> getCrewNoticeList(@AuthenticationPrincipal CustomUser customUser, @PathVariable("crew-id") Long crewId, @RequestParam("page-no") int pageNo) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루 공지 조회를 성공했습니다.", crewService.getCrewNoticeList(pageNo, crewId, customUser)));
    }

    // 크루 공지 수정
    @PutMapping("/notice/{id}")
    public ResponseEntity<BaseResponse<Void>> updateNotice(
            @PathVariable("id") Long noticeId,
            @RequestBody CrewRequest.CreateCrewNoticeRequest createCrewNoticeRequest) {
        try {
            crewService.updateNotice(noticeId, createCrewNoticeRequest);
            return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "공지를 수정하는데 성공했습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(BaseResponse.create(HttpStatus.BAD_REQUEST.value(), "공지 업데이트를 실패했습니다: " + e.getMessage()));
        }
    }

    // 크루 공지 삭제
    @DeleteMapping("/notice/{id}")
    public ResponseEntity<BaseResponse<Void>> deletePost(@PathVariable("id") Long noticeId) {
        try {
            crewService.deleteNotice(noticeId);
            return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "공지 삭제를 성공했습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(BaseResponse.create(HttpStatus.BAD_REQUEST.value(), "공지 삭제를 실패했습니다." + e.getMessage()));
        }
    }

    // 크루 권한 부여
    @PostMapping("/member/authority")
    public ResponseEntity<BaseResponse<Void>> updateMemberCrewPosition(@AuthenticationPrincipal CustomUser customUser, @RequestBody UpdateCrewPositionRequest updateCrewPositionRequest) {
        crewService.updateMemberCrewPosition(updateCrewPositionRequest, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "권한을 부여하는데 성공했습니다."));
    }

    // 크루원 조회
    @GetMapping("/member/{crew-id}")
    public ResponseEntity<BaseResponse<CrewResponse.CrewMemberItemResponse>> getCrewMemberList(@PathVariable("crew-id") Long crewId) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루원 조회를 성공했습니다.", crewService.getCrewMemberList(crewId)));
    }

    // 크루원 초대
    @PostMapping("/member/invitation")
    public ResponseEntity<BaseResponse<Void>> invitedCrewMember(@AuthenticationPrincipal CustomUser customUser, @RequestBody CrewMemberRequest crewMemberRequest) {
        crewService.inviteCrewMember(customUser, crewMemberRequest);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "새로운 크루를 초대하는데 성공했습니다."));
    }

    // 크루 초대 수락, 거절
    @PostMapping("/member/reply")
    public ResponseEntity<BaseResponse<Void>> replyCrewMember(@AuthenticationPrincipal CustomUser customUser, @RequestBody CrewReplyMemberRequest crewReplyMemberRequest) {
        crewService.replyCrewInvitation(customUser, crewReplyMemberRequest);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루 초대를 응답하는데 성공했습니다."));
    }

    // 크루 강퇴
    @DeleteMapping("/member")
    public ResponseEntity<BaseResponse<Void>> deleteCrewMember(@AuthenticationPrincipal CustomUser customUser, @RequestBody CrewMemberRequest crewMemberRequest) {
        crewService.deleteCrewMember(customUser, crewMemberRequest);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루원을 강퇴하는데 성공했습니다."));
    }

    // 크루 공지 상세 조회
    @GetMapping("/notice")
    public ResponseEntity<BaseResponse<PostResponse.PostItem>> getNoticeDetail(
            @RequestParam("crew-id") Long crewId,
            @RequestParam("notice-id") Long noticeId,
            @AuthenticationPrincipal CustomUser customUser) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "해당 공지 상세 조회를 성공했습니다.", crewService.getNoticeDetail(customUser, crewId, noticeId)));
    }
}
