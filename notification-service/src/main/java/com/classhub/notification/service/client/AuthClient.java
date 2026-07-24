package com.classhub.notification.service.client;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.classhub.notification.dto.internal.InternalUserResponse;

@FeignClient(name = "auth-service")
public interface AuthClient {

    @GetMapping("/api/v1/auth/internal/users/{userId}")
    InternalUserResponse getUser(
            @PathVariable UUID userId);

}