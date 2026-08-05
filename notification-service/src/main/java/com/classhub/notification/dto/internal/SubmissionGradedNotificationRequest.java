package com.classhub.notification.dto.internal;

import java.util.UUID;

import jakarta.validation.constraints.Min;
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
public class SubmissionGradedNotificationRequest {

    @NotNull
    private UUID submissionId;

    @NotNull
    private UUID assignmentId;

    @NotNull
    private UUID workspaceId;

    @NotNull
    private UUID studentId;

    @NotBlank
    private String assignmentTitle;

    @NotNull
    @Min(0)
    private Integer marksObtained;

    @NotNull
    @Min(0)
    private Integer maxMarks;

    private String feedback;
}