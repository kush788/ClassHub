package com.classhub.leaderboard.client;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.classhub.leaderboard.dto.external.InternalUserResponse;

@FeignClient(
        name = "auth-service",
        path = "/api/v1/auth"
)
public interface AuthServiceClient {

    @GetMapping("/internal/users/{userId}")
    InternalUserResponse getInternalUserById(
            @PathVariable("userId") UUID userId
    );
}