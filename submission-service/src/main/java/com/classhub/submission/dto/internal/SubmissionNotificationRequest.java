package com.classhub.submission.dto.internal;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionNotificationRequest {

    private UUID submissionId;

    private UUID assignmentId;

    private UUID workspaceId;

    private UUID studentId;

    private UUID teacherId;

    private String assignmentTitle;

    private LocalDateTime submittedAt;
}