package com.classhub.notification.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.classhub.notification.dto.internal.AssignmentNotificationRequest;
import com.classhub.notification.dto.internal.ResourceNotificationRequest;
import com.classhub.notification.dto.internal.SubmissionNotificationRequest;
import com.classhub.notification.service.NotificationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/assignment-created")
    public ResponseEntity<String> assignmentCreated(
            @Valid @RequestBody
            AssignmentNotificationRequest request) {

        log.info(
                "Assignment-created request received for workspace {}",
                request.getWorkspaceId()
        );

        notificationService.notifyAssignmentCreated(request);

        return ResponseEntity.ok(
                "Assignment notifications sent successfully."
        );
    }
    
    @PostMapping("/resource-uploaded")
    public ResponseEntity<String> resourceUploaded(
            @Valid @RequestBody
            ResourceNotificationRequest request) {

        log.info(
                "Resource-uploaded request received for workspace {}",
                request.getWorkspaceId());

        notificationService.notifyResourceUploaded(
                request);

        return ResponseEntity.ok(
                "Resource notifications sent successfully.");
    }
    
    @PostMapping("/assignment-submitted")
    public ResponseEntity<String> assignmentSubmitted(
            @Valid @RequestBody
            SubmissionNotificationRequest request) {

        log.info(
                "Assignment-submitted request received for submission {}",
                request.getSubmissionId());

        notificationService.notifyAssignmentSubmitted(request);

        return ResponseEntity.ok(
                "Assignment submission notification sent successfully.");
    }
}