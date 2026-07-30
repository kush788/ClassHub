package com.classhub.submission.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import feign.RequestInterceptor;

@Configuration
public class FeignAuthConfig {

    @Bean
    RequestInterceptor authorizationHeaderInterceptor() {

        return requestTemplate -> {

            var attributes =
                    org.springframework.web.context.request
                            .RequestContextHolder
                            .getRequestAttributes();

            if (attributes instanceof
                    org.springframework.web.context.request
                            .ServletRequestAttributes servletAttributes) {

                String authorizationHeader =
                        servletAttributes
                                .getRequest()
                                .getHeader("Authorization");

                if (authorizationHeader != null
                        && authorizationHeader.startsWith("Bearer ")) {

                    requestTemplate.header(
                            "Authorization",
                            authorizationHeader
                    );
                }
            }
        };
    }
}