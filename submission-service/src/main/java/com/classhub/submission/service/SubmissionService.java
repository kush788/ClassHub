package com.classhub.submission.service;

import java.util.List;
import java.util.UUID;

import com.classhub.submission.dto.CreateSubmissionRequest;
import com.classhub.submission.dto.GradeSubmissionRequest;
import com.classhub.submission.dto.UpdateSubmissionRequest;
import com.classhub.submission.dto.response.GradedSubmissionResponse;
import com.classhub.submission.dto.response.MessageResponse;
import com.classhub.submission.dto.response.SubmissionResponse;
import com.classhub.submission.security.AuthenticatedUser;

public interface SubmissionService {

    SubmissionResponse createSubmission(
            CreateSubmissionRequest request,
            AuthenticatedUser user
    );

    SubmissionResponse getSubmissionById(
            UUID submissionId,
            AuthenticatedUser user
    );

    List<SubmissionResponse> getMySubmissions(
            AuthenticatedUser user
    );

    List<SubmissionResponse> getSubmissionsByAssignment(
            UUID assignmentId,
            AuthenticatedUser user
    );

    SubmissionResponse updateSubmission(
            UUID submissionId,
            UpdateSubmissionRequest request,
            AuthenticatedUser user
    );

    SubmissionResponse gradeSubmission(
            UUID submissionId,
            GradeSubmissionRequest request,
            AuthenticatedUser user
    );

    MessageResponse deleteSubmission(
            UUID submissionId,
            AuthenticatedUser user
    );
    
    List<GradedSubmissionResponse> getGradedSubmissionsForLeaderboard(
            UUID workspaceId);
}