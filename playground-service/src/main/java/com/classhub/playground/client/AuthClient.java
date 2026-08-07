package com.classhub.playground.client;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.classhub.playground.client.config.FeignAuthConfig;
import com.classhub.playground.client.dto.InternalUserResponse;

@FeignClient(
        name = "auth-service",
        contextId = "playgroundAuthClient",
        configuration = FeignAuthConfig.class
)
public interface AuthClient {

    @GetMapping("/api/v1/auth/internal/users/{userId}")
    InternalUserResponse getUserById(
            @PathVariable("userId") UUID userId
    );
}