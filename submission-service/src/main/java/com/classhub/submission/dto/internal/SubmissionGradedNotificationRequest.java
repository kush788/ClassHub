package com.classhub.submission.dto.internal;

import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubmissionGradedNotificationRequest {

    private UUID submissionId;

    private UUID assignmentId;

    private UUID workspaceId;

    private UUID studentId;

    private String assignmentTitle;

    private Integer marksObtained;

    private Integer maxMarks;

    private String feedback;
}