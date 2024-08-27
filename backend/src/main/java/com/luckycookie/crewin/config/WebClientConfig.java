package com.luckycookie.crewin.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${t-map.api.url}")
    private String TMAP_API_URL;

    @Value("${t-map.api.appKey}")
    private String APP_KEY;

    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl(TMAP_API_URL)
            .defaultHeaders(httpHeaders -> {
                httpHeaders.add("appKey", APP_KEY);
            })
            .build();
    }
}
