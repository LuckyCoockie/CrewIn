package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.CrewRequest;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.service.CrewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
