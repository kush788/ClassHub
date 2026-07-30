package com.classhub.assignment.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.classhub.assignment.dto.CreateAssignmentRequest;
import com.classhub.assignment.dto.UpdateAssignmentRequest;
import com.classhub.assignment.dto.response.AssignmentResponse;
import com.classhub.assignment.dto.response.MessageResponse;
import com.classhub.assignment.security.AuthenticatedUser;
import com.classhub.assignment.service.AssignmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/assignments")
@RequiredArgsConstructor
@Validated
public class AssignmentController {

    private final AssignmentService assignmentService;

    /**
     * Create Assignment
     * Teacher Only
     */
    @PostMapping
    public ResponseEntity<AssignmentResponse> createAssignment(
            @Valid @RequestBody CreateAssignmentRequest request,
            @AuthenticationPrincipal AuthenticatedUser user) {

        AssignmentResponse response =
                assignmentService.createAssignment(
                        request,
                        user.userId());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    /**
     * Get Assignment
     */
    @GetMapping("/{assignmentId}")
    public ResponseEntity<AssignmentResponse> getAssignment(
            @PathVariable UUID assignmentId) {

        return ResponseEntity.ok(
                assignmentService.getAssignmentById(
                        assignmentId));
    }

    /**
     * Get Workspace Assignments
     */
    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<AssignmentResponse>>
    getWorkspaceAssignments(
            @PathVariable UUID workspaceId) {

        return ResponseEntity.ok(
                assignmentService
                        .getAssignmentsByWorkspace(
                                workspaceId));
    }

    /**
     * Update Assignment
     */
    @PutMapping("/{assignmentId}")
    public ResponseEntity<AssignmentResponse> updateAssignment(
            @PathVariable UUID assignmentId,
            @Valid @RequestBody UpdateAssignmentRequest request,
            @AuthenticationPrincipal AuthenticatedUser user) {

        return ResponseEntity.ok(
                assignmentService.updateAssignment(
                        assignmentId,
                        request,
                        user.userId()));
    }

    /**
     * Delete Assignment
     */
    @DeleteMapping("/{assignmentId}")
    public ResponseEntity<MessageResponse> deleteAssignment(
            @PathVariable UUID assignmentId,
            @AuthenticationPrincipal AuthenticatedUser user) {

        return ResponseEntity.ok(
                assignmentService.deleteAssignment(
                        assignmentId,
                        user.userId()));
    }

}