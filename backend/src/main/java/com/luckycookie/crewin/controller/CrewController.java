package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.CrewRequest;
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
    public ResponseEntity<BaseResponse<CrewItemResponse>> crewList(@RequestParam int pageNo) {
       return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루 목록 조회를 성공했습니다.", crewService.getCrewItem(pageNo)));
    }

}
