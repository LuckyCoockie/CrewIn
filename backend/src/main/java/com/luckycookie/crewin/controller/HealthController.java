package com.luckycookie.crewin.controller;

import com.luckycookie.crewin.security.util.TokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/health")
@RequiredArgsConstructor
public class HealthController {
    private final TokenUtil tokenUtil;

    @GetMapping()
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/token")
    public ResponseEntity<String> tokenValidation(@RequestHeader("Authorization") String token, HttpServletRequest request) {
        if (!tokenUtil.validateToken(token.substring(7), request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
        return ResponseEntity.ok("OK");
    }
}
