package com.classhub.submission.dto.response;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradedSubmissionResponse {

    private UUID submissionId;

    private UUID assignmentId;

    private UUID workspaceId;

    private UUID studentId;

    private Integer marksObtained;
}