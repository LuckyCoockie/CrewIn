package com.luckycookie.crewin.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {


    @Value("${spring.rabbitmq.host}")
    private String relayHost;

    @Value("${spring.rabbitmq.username}")
    private String relayUsername;

    @Value("${spring.rabbitmq.password}")
    private String relayPassword;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app") // application으로 메시지 전송시 붙어야 하는 prefix - app에서 처리되는 메시지 라는 것을 나타냄
                .enableStompBrokerRelay("/topic") // 전송된 메시지 라우팅을 위한 목적지 prefix
                .setRelayHost(relayHost)
                .setClientLogin(relayUsername)
                .setClientPasscode(relayPassword)
                .setSystemLogin(relayUsername)
                .setSystemPasscode(relayPassword);
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-connect")            // WebSocket 엔드포인트 경로
                .setAllowedOrigins("*")              // CORS 설정
                .withSockJS();                       // SockJS 지원 활성화
    }
}
