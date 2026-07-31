package com.classhub.submission.client.notification;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.classhub.submission.dto.internal.SubmissionNotificationRequest;

@FeignClient(
        name = "notification-service",
        contextId = "submissionNotificationClient"
)
public interface NotificationClient {

    @PostMapping(
            "/api/v1/notifications/assignment-submitted"
    )
    String notifyAssignmentSubmitted(
            @RequestBody
            SubmissionNotificationRequest request);
}