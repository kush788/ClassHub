package com.classhub.resource.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.classhub.resource.dto.internal.ResourceNotificationRequest;

@FeignClient(
        name = "notification-service",
        contextId = "resourceNotificationClient"
)
public interface NotificationClient {

    @PostMapping(
            "/api/v1/notifications/resource-uploaded"
    )
    String notifyResourceUploaded(
            @RequestBody
            ResourceNotificationRequest request);
}