package com.luckycookie.crewin.config;

import com.luckycookie.crewin.repository.MemberRepository;
import com.luckycookie.crewin.security.JwtAccessDeniedHandler;
import com.luckycookie.crewin.security.JwtAuthenticationEntryPoint;
import com.luckycookie.crewin.security.JwtFilter;
import com.luckycookie.crewin.security.util.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity // 서블릿 필터에 스프링 시큐리티 필터 체인을 추가
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final MemberRepository memberRepository;
    private final TokenUtil tokenUtil;

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // requestMatchers 맨 위부터 동작한다.
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(auth -> auth.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint)
                        .accessDeniedHandler(jwtAccessDeniedHandler))
                .addFilterBefore(new JwtFilter(tokenUtil, memberRepository), UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests((a) -> {
                    a.requestMatchers("/login").permitAll()
                            .anyRequest().authenticated();
                });

        return http.build();
    }

}
