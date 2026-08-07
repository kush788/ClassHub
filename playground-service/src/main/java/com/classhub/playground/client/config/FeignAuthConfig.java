package com.classhub.playground.client.config;

import feign.RequestInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignAuthConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {

        return template -> {

            RequestAttributes attributes =
                    RequestContextHolder.getRequestAttributes();

            if (!(attributes instanceof ServletRequestAttributes servletAttributes)) {
                return;
            }

            HttpServletRequest request =
                    servletAttributes.getRequest();

            String authorizationHeader =
                    request.getHeader(HttpHeaders.AUTHORIZATION);

            if (authorizationHeader != null
                    && !authorizationHeader.isBlank()) {

                template.header(
                        HttpHeaders.AUTHORIZATION,
                        authorizationHeader
                );
            }
        };
    }
}