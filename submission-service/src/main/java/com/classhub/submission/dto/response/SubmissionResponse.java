package com.classhub.submission.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.classhub.submission.enums.SubmissionStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubmissionResponse {

    private UUID id;

    private UUID assignmentId;

    private UUID workspaceId;

    private UUID studentId;

    private String content;

    private String attachmentUrl;

    private Integer marksObtained;

    private String feedback;

    private SubmissionStatus status;

    private LocalDateTime submittedAt;

    private LocalDateTime updatedAt;

}