package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.CrewRequest;
import com.luckycookie.crewin.dto.CrewResponse.CrewItemResponse;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.service.CrewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/crew")
public class CrewController {

    private final CrewService crewService;

    @PostMapping()
    public ResponseEntity<BaseResponse<Void>> createCrew(@RequestBody CrewRequest.CreateCrewRequest createCrewRequest) {
        crewService.createCrew(createCrewRequest);
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루를 생성하는데 성공했습니다."));
    }

    // 전체 크루 조회 (크루 없는 사람)
    @GetMapping()
    public ResponseEntity<BaseResponse<CrewItemResponse>> crewList(@RequestParam int pageNo) {
       return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루 목록 조회를 성공했습니다.", crewService.getCrewItem(pageNo)));
    }

}
