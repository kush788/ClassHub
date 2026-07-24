package com.classhub.notification.service;

import com.classhub.notification.dto.internal.AssignmentNotificationRequest;
import com.classhub.notification.dto.internal.ResourceNotificationRequest;
import com.classhub.notification.dto.internal.SubmissionNotificationRequest;

public interface NotificationService {

    void notifyAssignmentCreated(
            AssignmentNotificationRequest request);
    void notifyResourceUploaded(
            ResourceNotificationRequest request);
    void notifyAssignmentSubmitted(
            SubmissionNotificationRequest request);

}