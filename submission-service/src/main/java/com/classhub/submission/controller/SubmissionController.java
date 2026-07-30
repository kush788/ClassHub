package com.classhub.submission.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.classhub.submission.dto.CreateSubmissionRequest;
import com.classhub.submission.dto.GradeSubmissionRequest;
import com.classhub.submission.dto.UpdateSubmissionRequest;
import com.classhub.submission.dto.response.GradedSubmissionResponse;
import com.classhub.submission.dto.response.MessageResponse;
import com.classhub.submission.dto.response.SubmissionResponse;
import com.classhub.submission.security.AuthenticatedUser;
import com.classhub.submission.service.SubmissionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<SubmissionResponse> createSubmission(
            @Valid
            @RequestBody CreateSubmissionRequest request,

            @AuthenticationPrincipal
            AuthenticatedUser user) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        submissionService.createSubmission(
                                request,
                                user
                        )
                );
    }

    @GetMapping("/{submissionId}")
    public ResponseEntity<SubmissionResponse>
    getSubmissionById(

            @PathVariable UUID submissionId,

            @AuthenticationPrincipal
            AuthenticatedUser user) {

        return ResponseEntity.ok(
                submissionService.getSubmissionById(
                        submissionId,
                        user
                )
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<SubmissionResponse>>
    getMySubmissions(

            @AuthenticationPrincipal
            AuthenticatedUser user) {

        return ResponseEntity.ok(
                submissionService.getMySubmissions(user)
        );
    }

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<SubmissionResponse>>
    getSubmissionsByAssignment(

            @PathVariable UUID assignmentId,

            @AuthenticationPrincipal
            AuthenticatedUser user) {

        return ResponseEntity.ok(
                submissionService
                        .getSubmissionsByAssignment(
                                assignmentId,
                                user
                        )
        );
    }

    @PutMapping("/{submissionId}")
    public ResponseEntity<SubmissionResponse>
    updateSubmission(

            @PathVariable UUID submissionId,

            @Valid
            @RequestBody UpdateSubmissionRequest request,

            @AuthenticationPrincipal
            AuthenticatedUser user) {

        return ResponseEntity.ok(
                submissionService.updateSubmission(
                        submissionId,
                        request,
                        user
                )
        );
    }

    @PutMapping("/{submissionId}/grade")
    public ResponseEntity<SubmissionResponse>
    gradeSubmission(

            @PathVariable UUID submissionId,

            @Valid
            @RequestBody GradeSubmissionRequest request,

            @AuthenticationPrincipal
            AuthenticatedUser user) {

        return ResponseEntity.ok(
                submissionService.gradeSubmission(
                        submissionId,
                        request,
                        user
                )
        );
    }
    
    @GetMapping("/internal/workspace/{workspaceId}/graded")
    public ResponseEntity<List<GradedSubmissionResponse>>
    getGradedSubmissionsForLeaderboard(
            @PathVariable UUID workspaceId) {

        return ResponseEntity.ok(
                submissionService
                        .getGradedSubmissionsForLeaderboard(
                                workspaceId));
    }
    
    

    @DeleteMapping("/{submissionId}")
    public ResponseEntity<MessageResponse>
    deleteSubmission(

            @PathVariable UUID submissionId,

            @AuthenticationPrincipal
            AuthenticatedUser user) {

        return ResponseEntity.ok(
                submissionService.deleteSubmission(
                        submissionId,
                        user
                )
        );
    }
}