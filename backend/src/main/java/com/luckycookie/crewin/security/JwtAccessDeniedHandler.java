package com.luckycookie.crewin.security;

import com.luckycookie.crewin.exception.constants.SecurityExceptionList;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

import static com.luckycookie.crewin.exception.constants.SecurityExceptionList.*;

@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        // 필요한 권한이 없이 접근하려 할때 403
        setResponse(response, ACCESS_DENIED_03);
    }

    private void setResponse(HttpServletResponse response, SecurityExceptionList exception) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpStatus.FORBIDDEN.value());

        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("timeStamp", LocalDateTime.now().withNano(0).toString());
        jsonResponse.put("errorCode", exception.getErrorCode());
        jsonResponse.put("message", exception.getMessage());

        response.getWriter().print(jsonResponse);
    }
}
