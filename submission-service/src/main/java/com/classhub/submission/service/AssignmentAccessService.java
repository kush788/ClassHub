package com.classhub.submission.service;

import java.util.UUID;

import com.classhub.submission.client.assignment.dto.AssignmentResponse;

public interface AssignmentAccessService {

    AssignmentResponse getAssignment(UUID assignmentId);
}