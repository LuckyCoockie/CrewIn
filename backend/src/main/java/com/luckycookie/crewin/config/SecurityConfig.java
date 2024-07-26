package com.luckycookie.crewin.config;

import com.luckycookie.crewin.repository.MemberRepository;
import com.luckycookie.crewin.security.JwtAccessDeniedHandler;
import com.luckycookie.crewin.security.JwtAuthenticationEntryPoint;
import com.luckycookie.crewin.security.JwtFilter;
import com.luckycookie.crewin.security.util.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsUtils;

import java.util.Arrays;
import java.util.List;

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
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests((a) -> {
                    a.requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
                            .requestMatchers("/member/signup/**").permitAll()
                            .requestMatchers("/member/check-email").permitAll()
                            .requestMatchers("/member/check-nickname").permitAll()
                            .requestMatchers("/member/email").permitAll()
                            .requestMatchers("/member/login").permitAll()
                            .requestMatchers("/member/reissue").permitAll()
                            .requestMatchers("/member/email").permitAll() // 이메일(id) 찾기
                            .requestMatchers(HttpMethod.POST, "/member/password").permitAll() // 임시 비밀번호 발급만 접근 허용
                            .anyRequest().authenticated();
                });

        return http.build();
    }
}
