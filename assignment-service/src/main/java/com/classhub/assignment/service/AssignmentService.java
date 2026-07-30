package com.classhub.assignment.service;

import java.util.List;
import java.util.UUID;

import com.classhub.assignment.dto.CreateAssignmentRequest;
import com.classhub.assignment.dto.UpdateAssignmentRequest;
import com.classhub.assignment.dto.response.AssignmentResponse;
import com.classhub.assignment.dto.response.MessageResponse;

public interface AssignmentService {

    AssignmentResponse createAssignment(
            CreateAssignmentRequest request,
            UUID teacherId);

    AssignmentResponse getAssignmentById(
            UUID assignmentId);

    List<AssignmentResponse> getAssignmentsByWorkspace(
            UUID workspaceId);

    AssignmentResponse updateAssignment(
            UUID assignmentId,
            UpdateAssignmentRequest request,
            UUID teacherId);

    MessageResponse deleteAssignment(
            UUID assignmentId,
            UUID teacherId);
}