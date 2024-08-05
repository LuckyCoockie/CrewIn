package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.dto.CrewResponse.CrewItemResponse;
import com.luckycookie.crewin.dto.MemberResponse;
import com.luckycookie.crewin.dto.SearchResponse.MemberInvitationPageResponse;
import com.luckycookie.crewin.dto.base.BaseResponse;
import com.luckycookie.crewin.security.dto.CustomUser;
import com.luckycookie.crewin.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/search")
public class SearchController {
    private final SearchService searchService;

    @GetMapping("/crew")
    public ResponseEntity<BaseResponse<CrewItemResponse>> searchCrew(@AuthenticationPrincipal CustomUser customUser,
                                                                     @RequestParam String query,
                                                                     @RequestParam(name = "page-no", defaultValue = "0") int pageNo) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "해당 크루 검색 결과 조회를 성공했습니다."
                ,searchService.searchCrew(query, pageNo, customUser)));
    }

    @GetMapping("/member")
    public ResponseEntity<BaseResponse<MemberResponse.MemberSearchResponse>> searchMember(@AuthenticationPrincipal CustomUser customUser,
                                                                                        @RequestParam String query,
                                                                                        @RequestParam(name = "page-no", defaultValue = "0") int pageNo) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "해당 멤버 검색 결과 조회를 성공했습니다."
                ,searchService.searchMember(query, pageNo, customUser)));
    }

    @GetMapping("/invite-member/{crew-id}")
    public ResponseEntity<BaseResponse<MemberInvitationPageResponse>> searchMemberForCrewInvitation(@AuthenticationPrincipal CustomUser customUser,
                                                                                                    @PathVariable("crew-id") Long crewId,
                                                                                                    @RequestParam(name = "query", defaultValue = "") String query,
                                                                                                    @RequestParam(name = "page-no", defaultValue = "0") int pageNo) {
        return ResponseEntity.ok(BaseResponse.create(HttpStatus.OK.value(), "크루 초대를 위한 멤버 검색 결과 조회를 성공했습니다."
                ,searchService.getMemberForCrewInvitation(crewId, query, customUser, pageNo)));

    }


}
