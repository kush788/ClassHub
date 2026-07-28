package com.classhub.resource.client.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import feign.RequestInterceptor;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
public class FeignAuthConfig {

    @Bean
    public RequestInterceptor authorizationForwardingInterceptor() {

        return requestTemplate -> {

            ServletRequestAttributes attributes =
                    (ServletRequestAttributes)
                            RequestContextHolder
                                    .getRequestAttributes();

            if (attributes == null) {
                return;
            }

            HttpServletRequest currentRequest =
                    attributes.getRequest();

            String authorizationHeader =
                    currentRequest.getHeader("Authorization");

            if (authorizationHeader != null
                    && !authorizationHeader.isBlank()) {

                requestTemplate.header(
                        "Authorization",
                        authorizationHeader);
            }
        };
    }
}