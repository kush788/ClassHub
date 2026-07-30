package com.classhub.assignment.service.impl;
import com.classhub.assignment.client.NotificationClient;
import com.classhub.assignment.dto.internal.AssignmentNotificationRequest;

import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.classhub.assignment.dto.CreateAssignmentRequest;
import com.classhub.assignment.dto.UpdateAssignmentRequest;
import com.classhub.assignment.dto.response.AssignmentResponse;
import com.classhub.assignment.dto.response.MessageResponse;
import com.classhub.assignment.entity.Assignment;
import com.classhub.assignment.exception.AssignmentAccessDeniedException;
import com.classhub.assignment.exception.AssignmentNotFoundException;
import com.classhub.assignment.repository.AssignmentRepository;
import com.classhub.assignment.service.AssignmentService;
import com.classhub.assignment.service.WorkspaceAccessService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssignmentServiceImpl
        implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final WorkspaceAccessService workspaceAccessService;
    private final NotificationClient notificationClient;
    
    /*
     * =========================================================
     * CREATE ASSIGNMENT
     * =========================================================
     */

    @Override
    @Transactional
    public AssignmentResponse createAssignment(
            CreateAssignmentRequest request,
            UUID teacherId) {

        /*
         * Confirms that:
         * - workspace exists
         * - workspace is active
         * - authenticated teacher owns it
         */
        workspaceAccessService.requireManageAccess(
                request.getWorkspaceId());

        Assignment assignment = Assignment.builder()
                .workspaceId(request.getWorkspaceId())
                .teacherId(teacherId)
                .title(request.getTitle().trim())
                .description(
                        normalizeText(
                                request.getDescription()))
                .instructions(
                        normalizeText(
                                request.getInstructions()))
                .maxMarks(request.getMaxMarks())
                .dueDate(request.getDueDate())
                .active(true)
                .build();

        Assignment savedAssignment =
                assignmentRepository.save(assignment);

        sendAssignmentCreatedNotification(
                savedAssignment);

        return mapToResponse(savedAssignment);
    }

    /*
     * =========================================================
     * GET ASSIGNMENT BY ID
     * =========================================================
     */

    @Override
    @Transactional(readOnly = true)
    public AssignmentResponse getAssignmentById(
            UUID assignmentId) {

        Assignment assignment =
                findActiveAssignment(assignmentId);

        /*
         * Owner teacher or joined student can view.
         */
        workspaceAccessService.requireViewAccess(
                assignment.getWorkspaceId());

        return mapToResponse(assignment);
    }

    /*
     * =========================================================
     * LIST ASSIGNMENTS OF A WORKSPACE
     * =========================================================
     */

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignmentsByWorkspace(
            UUID workspaceId) {

        /*
         * Owner teacher or joined student can view.
         */
        workspaceAccessService.requireViewAccess(
                workspaceId);

        return assignmentRepository
                .findByWorkspaceIdAndActiveTrueOrderByDueDateAsc(
                        workspaceId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /*
     * =========================================================
     * UPDATE ASSIGNMENT
     * Implemented in Part 2.
     * =========================================================
     */

    @Override
    @Transactional
    public AssignmentResponse updateAssignment(
            UUID assignmentId,
            UpdateAssignmentRequest request,
            UUID teacherId) {

        Assignment assignment =
                findActiveAssignment(assignmentId);

        workspaceAccessService.requireManageAccess(
                assignment.getWorkspaceId());

        if (!assignment.getTeacherId().equals(teacherId)) {
            throw new AssignmentAccessDeniedException(
                    "You cannot update this assignment.");
        }

        assignment.setTitle(
                request.getTitle().trim());

        assignment.setDescription(
                normalizeText(
                        request.getDescription()));

        assignment.setInstructions(
                normalizeText(
                        request.getInstructions()));

        assignment.setMaxMarks(
                request.getMaxMarks());

        assignment.setDueDate(
                request.getDueDate());

        Assignment updatedAssignment =
                assignmentRepository.save(assignment);

        return mapToResponse(updatedAssignment);
    }

    /*
     * =========================================================
     * DELETE ASSIGNMENT
     * Implemented here so the class compiles completely.
     * =========================================================
     */

    @Override
    @Transactional
    public MessageResponse deleteAssignment(
            UUID assignmentId,
            UUID teacherId) {

        Assignment assignment =
                findActiveAssignment(assignmentId);

        workspaceAccessService.requireManageAccess(
                assignment.getWorkspaceId());

        if (!assignment.getTeacherId().equals(teacherId)) {
            throw new AssignmentAccessDeniedException(
                    "You cannot delete this assignment.");
        }

        /*
         * Soft delete:
         * retain the row for history, but hide it from APIs.
         */
        assignment.setActive(false);

        assignmentRepository.save(assignment);

        return new MessageResponse(
                "Assignment deleted successfully.");
    }

    /*
     * =========================================================
     * COMMON HELPER: FIND ACTIVE ASSIGNMENT
     * =========================================================
     */

    private Assignment findActiveAssignment(
            UUID assignmentId) {

        return assignmentRepository
                .findByIdAndActiveTrue(assignmentId)
                .orElseThrow(() ->
                        new AssignmentNotFoundException(
                                "Assignment not found."));
    }

    /*
     * =========================================================
     * COMMON HELPER: NORMALIZE OPTIONAL TEXT
     * =========================================================
     */

    private String normalizeText(
            String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    /*
     * =========================================================
     * ENTITY → RESPONSE DTO
     * =========================================================
     */
    private void sendAssignmentCreatedNotification(
            Assignment assignment) {

        AssignmentNotificationRequest notificationRequest =
                AssignmentNotificationRequest.builder()
                        .workspaceId(
                                assignment.getWorkspaceId())
                        .teacherId(
                                assignment.getTeacherId())
                        .assignmentTitle(
                                assignment.getTitle())
                        .dueDate(
                                assignment.getDueDate())
                        .build();

        try {
            notificationClient.notifyAssignmentCreated(
                    notificationRequest);

            log.info(
                    "Assignment-created notification triggered for assignment {}",
                    assignment.getId());

        } catch (Exception exception) {

            /*
             * Assignment creation must remain successful even when
             * the Notification Service or Gmail is temporarily down.
             */
            log.error(
                    "Assignment {} was created, but notification delivery failed.",
                    assignment.getId(),
                    exception);
        }
    }

    private AssignmentResponse mapToResponse(
            Assignment assignment) {

        return AssignmentResponse.builder()
                .id(assignment.getId())
                .workspaceId(
                        assignment.getWorkspaceId())
                .teacherId(
                        assignment.getTeacherId())
                .title(
                        assignment.getTitle())
                .description(
                        assignment.getDescription())
                .instructions(
                        assignment.getInstructions())
                .maxMarks(
                        assignment.getMaxMarks())
                .dueDate(
                        assignment.getDueDate())
                .active(
                        assignment.isActive())
                .createdAt(
                        assignment.getCreatedAt())
                .updatedAt(
                        assignment.getUpdatedAt())
                .build();
    }
}