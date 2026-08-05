package com.classhub.workspace.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import feign.RequestInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class FeignAuthInterceptor {

    private final HttpServletRequest httpServletRequest;

    @Bean
    public RequestInterceptor authorizationRequestInterceptor() {

        return requestTemplate -> {

            String authorization =
                    httpServletRequest.getHeader(
                            "Authorization"
                    );

            if (
                    authorization != null &&
                    !authorization.isBlank()
            ) {
                requestTemplate.header(
                        "Authorization",
                        authorization
                );
            }
        };
    }
}