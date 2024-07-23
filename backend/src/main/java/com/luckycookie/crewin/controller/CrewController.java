package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.CrewRequest;
import com.luckycookie.crewin.dto.CrewResponse;
import com.luckycookie.crewin.dto.CrewResponse.CrewItemResponse;
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

    @PostMapping()
    public ResponseEntity<BaseResponse<Void>> createCrew(@AuthenticationPrincipal CustomUser customUser, @RequestBody CrewRequest.CreateCrewRequest createCrewRequest) {
        crewService.createCrew(createCrewRequest, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루를 생성하는데 성공했습니다."));
    }

    // 전체 크루 조회 (크루 없는 사람)
    @GetMapping()
    public ResponseEntity<BaseResponse<CrewItemResponse>> getAllCrewList(@AuthenticationPrincipal CustomUser customUser,@RequestParam int pageNo) {
       return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "전체 크루 목록 조회를 성공했습니다.", crewService.getCrewList(pageNo, customUser)));
    }

    // 내가 속한 크루 조회 (크루원 / 비크루원)
    @GetMapping("/my-crew")
    public ResponseEntity<BaseResponse<CrewItemResponse>> getMyCrewList(@AuthenticationPrincipal CustomUser customUser,@RequestParam int pageNo) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "내가 속한 크루 목록 조회를 성공했습니다.", crewService.getCrewList(pageNo, customUser)));
    }


    @PostMapping("/notice")
    public ResponseEntity<BaseResponse<Void>> createCrewNotice(@AuthenticationPrincipal CustomUser customUser, @RequestBody CrewRequest.CreateCrewNoticeRequest createCrewNoticeRequest) {
        crewService.createCrewNotice(createCrewNoticeRequest, customUser);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루 공지를 생성하는데 성공했습니다."));
    }

    // 크루 정보 조회
    @GetMapping("/detail/{crewId}")
    public ResponseEntity<BaseResponse<CrewResponse.CrewInfoItem>> getCrewDetailInfo(@PathVariable Long crewId) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루 정보 조회를 성공했습니다.", crewService.getCrewInfo(crewId)));
    }

}
