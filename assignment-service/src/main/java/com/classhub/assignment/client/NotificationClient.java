package com.classhub.assignment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.classhub.assignment.dto.internal.AssignmentNotificationRequest;

@FeignClient(name = "notification-service")
public interface NotificationClient {

    @PostMapping(
        "/api/v1/notifications/assignment-created"
    )
    String notifyAssignmentCreated(
            @RequestBody
            AssignmentNotificationRequest request);
}