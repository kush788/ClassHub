package com.classhub.submission.service.impl;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.classhub.submission.client.assignment.AssignmentClient;
import com.classhub.submission.client.assignment.dto.AssignmentResponse;
import com.classhub.submission.exception.AssignmentNotFoundForSubmissionException;
import com.classhub.submission.exception.AssignmentServiceUnavailableException;
import com.classhub.submission.service.AssignmentAccessService;

import feign.FeignException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AssignmentAccessServiceImpl
        implements AssignmentAccessService {

    private final AssignmentClient assignmentClient;

    @Override
    public AssignmentResponse getAssignment(UUID assignmentId) {

        try {

            AssignmentResponse assignment =
                    assignmentClient.getAssignmentById(assignmentId);

            if (assignment == null || !assignment.active()) {
                throw new AssignmentNotFoundForSubmissionException(
                        "Assignment not found"
                );
            }

            return assignment;

        } catch (FeignException.NotFound exception) {

            throw new AssignmentNotFoundForSubmissionException(
                    "Assignment not found with ID: " + assignmentId
            );

        } catch (FeignException.Forbidden exception) {

            throw new AssignmentNotFoundForSubmissionException(
                    "You do not have access to this assignment"
            );

        } catch (AssignmentNotFoundForSubmissionException exception) {

            throw exception;

        } catch (FeignException exception) {

            throw new AssignmentServiceUnavailableException(
                    "Assignment Service is currently unavailable"
            );
        }
    }
}