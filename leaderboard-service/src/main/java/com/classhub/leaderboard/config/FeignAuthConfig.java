package com.classhub.leaderboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import feign.RequestInterceptor;

@Configuration
public class FeignAuthConfig {

    @Bean
    public RequestInterceptor bearerTokenRequestInterceptor() {

        return requestTemplate -> {

            var attributes =
                    RequestContextHolder.getRequestAttributes();

            if (attributes instanceof
                    ServletRequestAttributes servletAttributes) {

                String authorization =
                        servletAttributes
                                .getRequest()
                                .getHeader("Authorization");

                if (authorization != null
                        && authorization.startsWith("Bearer ")) {

                    requestTemplate.header(
                            "Authorization",
                            authorization
                    );
                }
            }
        };
    }
} 