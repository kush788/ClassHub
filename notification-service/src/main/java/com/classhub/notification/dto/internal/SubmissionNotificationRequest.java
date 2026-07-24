package com.classhub.notification.dto.internal;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionNotificationRequest {

    @NotNull
    private UUID submissionId;

    @NotNull
    private UUID assignmentId;

    @NotNull
    private UUID workspaceId;

    @NotNull
    private UUID studentId;

    @NotNull
    private UUID teacherId;

    @NotBlank
    private String assignmentTitle;

    @NotNull
    private LocalDateTime submittedAt;
}