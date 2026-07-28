package com.classhub.leaderboard.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GradedSubmissionData {

    private UUID submissionId;
    private UUID assignmentId;
    private UUID workspaceId;
    private UUID studentId;
    private Integer marksObtained;
}