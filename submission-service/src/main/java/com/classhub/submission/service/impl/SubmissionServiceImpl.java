package com.classhub.submission.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.classhub.submission.client.assignment.dto.AssignmentResponse;
import com.classhub.submission.client.notification.NotificationClient;
import com.classhub.submission.dto.CreateSubmissionRequest;
import com.classhub.submission.dto.GradeSubmissionRequest;
import com.classhub.submission.dto.UpdateSubmissionRequest;
import com.classhub.submission.dto.internal.SubmissionGradedNotificationRequest;
import com.classhub.submission.dto.internal.SubmissionNotificationRequest;
import com.classhub.submission.dto.response.GradedSubmissionResponse;
import com.classhub.submission.dto.response.MessageResponse;
import com.classhub.submission.dto.response.SubmissionResponse;
import com.classhub.submission.entity.Submission;
import com.classhub.submission.enums.SubmissionStatus;
import com.classhub.submission.exception.DuplicateSubmissionException;
import com.classhub.submission.exception.InvalidSubmissionOperationException;
import com.classhub.submission.exception.SubmissionAccessDeniedException;
import com.classhub.submission.exception.SubmissionDeadlinePassedException;
import com.classhub.submission.exception.SubmissionNotFoundException;
import com.classhub.submission.repository.SubmissionRepository;
import com.classhub.submission.security.AuthenticatedUser;
import com.classhub.submission.service.AssignmentAccessService;
import com.classhub.submission.service.SubmissionService;
import com.classhub.submission.service.WorkspaceAccessService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SubmissionServiceImpl
        implements SubmissionService {

    private final SubmissionRepository submissionRepository;

    private final AssignmentAccessService assignmentAccessService;

    private final WorkspaceAccessService workspaceAccessService;

    private final NotificationClient notificationClient;

    @Override
    public SubmissionResponse createSubmission(
            CreateSubmissionRequest request,
            AuthenticatedUser user) {

        AssignmentResponse assignment =
                assignmentAccessService.getAssignment(
                        request.getAssignmentId()
                );

        workspaceAccessService.requireMemberAccess(
                assignment.workspaceId()
        );

        validateDeadline(assignment);

        boolean alreadySubmitted =
                submissionRepository
                        .existsByAssignmentIdAndStudentIdAndActiveTrue(
                                assignment.id(),
                                user.userId()
                        );

        if (alreadySubmitted) {
            throw new DuplicateSubmissionException(
                    "You have already submitted this assignment"
            );
        }

        Submission submission =
                Submission.builder()
                        .assignmentId(
                                assignment.id()
                        )
                        .workspaceId(
                                assignment.workspaceId()
                        )
                        .studentId(
                                user.userId()
                        )
                        .content(
                                normalizeText(
                                        request.getContent()
                                )
                        )
                        .attachmentUrl(
                                normalizeText(
                                        request.getAttachmentUrl()
                                )
                        )
                        .status(
                                SubmissionStatus.SUBMITTED
                        )
                        .active(true)
                        .build();

        Submission saved =
                submissionRepository.save(
                        submission
                );

        sendAssignmentSubmittedNotification(
                saved,
                assignment
        );

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public SubmissionResponse getSubmissionById(
            UUID submissionId,
            AuthenticatedUser user) {

        Submission submission =
                findActiveSubmission(
                        submissionId
                );

        if (!submission.getStudentId()
                .equals(user.userId())) {

            workspaceAccessService.requireManageAccess(
                    submission.getWorkspaceId()
            );
        }

        return mapToResponse(submission);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubmissionResponse> getMySubmissions(
            AuthenticatedUser user) {

        return submissionRepository
                .findByStudentIdAndActiveTrueOrderBySubmittedAtDesc(
                        user.userId()
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubmissionResponse>
    getSubmissionsByAssignment(
            UUID assignmentId,
            AuthenticatedUser user) {

        AssignmentResponse assignment =
                assignmentAccessService
                        .getAssignment(
                                assignmentId
                        );

        workspaceAccessService.requireManageAccess(
                assignment.workspaceId()
        );

        return submissionRepository
                .findByAssignmentIdAndActiveTrueOrderBySubmittedAtDesc(
                        assignmentId
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public SubmissionResponse updateSubmission(
            UUID submissionId,
            UpdateSubmissionRequest request,
            AuthenticatedUser user) {

        Submission submission =
                findActiveSubmission(
                        submissionId
                );

        if (!submission.getStudentId()
                .equals(user.userId())) {

            throw new SubmissionAccessDeniedException(
                    "You can update only your own submission"
            );
        }

        if (submission.getStatus()
                == SubmissionStatus.GRADED) {

            throw new InvalidSubmissionOperationException(
                    "A graded submission cannot be updated"
            );
        }

        AssignmentResponse assignment =
                assignmentAccessService
                        .getAssignment(
                                submission.getAssignmentId()
                        );

        validateDeadline(assignment);

        submission.setContent(
                normalizeText(
                        request.getContent()
                )
        );

        submission.setAttachmentUrl(
                normalizeText(
                        request.getAttachmentUrl()
                )
        );

        Submission updated =
                submissionRepository.save(
                        submission
                );

        return mapToResponse(updated);
    }

    @Override
    public SubmissionResponse gradeSubmission(
            UUID submissionId,
            GradeSubmissionRequest request,
            AuthenticatedUser user) {

        Submission submission =
                findActiveSubmission(
                        submissionId
                );

        AssignmentResponse assignment =
                assignmentAccessService
                        .getAssignment(
                                submission.getAssignmentId()
                        );

        workspaceAccessService.requireManageAccess(
                assignment.workspaceId()
        );

        if (request.getMarksObtained()
                > assignment.maxMarks()) {

            throw new InvalidSubmissionOperationException(
                    "Marks obtained cannot exceed maximum marks: "
                            + assignment.maxMarks()
            );
        }

        submission.setMarksObtained(
                request.getMarksObtained()
        );

        submission.setFeedback(
                normalizeText(
                        request.getFeedback()
                )
        );

        submission.setStatus(
                SubmissionStatus.GRADED
        );

        Submission graded =
                submissionRepository.save(
                        submission
                );

        sendSubmissionGradedNotification(
                graded,
                assignment
        );

        return mapToResponse(graded);
    }

    @Override
    public MessageResponse deleteSubmission(
            UUID submissionId,
            AuthenticatedUser user) {

        Submission submission =
                findActiveSubmission(
                        submissionId
                );

        if (!submission.getStudentId()
                .equals(user.userId())) {

            throw new SubmissionAccessDeniedException(
                    "You can delete only your own submission"
            );
        }

        if (submission.getStatus()
                == SubmissionStatus.GRADED) {

            throw new InvalidSubmissionOperationException(
                    "A graded submission cannot be deleted"
            );
        }

        AssignmentResponse assignment =
                assignmentAccessService
                        .getAssignment(
                                submission.getAssignmentId()
                        );

        validateDeadline(assignment);

        submission.setActive(false);

        submissionRepository.save(
                submission
        );

        return new MessageResponse(
                "Submission deleted successfully"
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradedSubmissionResponse>
    getGradedSubmissionsForLeaderboard(
            UUID workspaceId) {

        return submissionRepository
                .findByWorkspaceIdAndStatusAndActiveTrue(
                        workspaceId,
                        SubmissionStatus.GRADED
                )
                .stream()
                .map(submission ->
                        GradedSubmissionResponse
                                .builder()
                                .submissionId(
                                        submission.getId()
                                )
                                .assignmentId(
                                        submission.getAssignmentId()
                                )
                                .workspaceId(
                                        submission.getWorkspaceId()
                                )
                                .studentId(
                                        submission.getStudentId()
                                )
                                .marksObtained(
                                        submission.getMarksObtained()
                                )
                                .build()
                )
                .toList();
    }

    private Submission findActiveSubmission(
            UUID submissionId) {

        return submissionRepository
                .findByIdAndActiveTrue(
                        submissionId
                )
                .orElseThrow(() ->
                        new SubmissionNotFoundException(
                                "Submission not found with ID: "
                                        + submissionId
                        )
                );
    }

    private void validateDeadline(
            AssignmentResponse assignment) {

        if (assignment.dueDate() != null
                && LocalDateTime.now()
                .isAfter(
                        assignment.dueDate()
                )) {

            throw new SubmissionDeadlinePassedException(
                    "The assignment deadline has passed"
            );
        }
    }

    private void sendAssignmentSubmittedNotification(
            Submission submission,
            AssignmentResponse assignment) {

        try {

            SubmissionNotificationRequest request =
                    SubmissionNotificationRequest
                            .builder()
                            .submissionId(
                                    submission.getId()
                            )
                            .assignmentId(
                                    submission.getAssignmentId()
                            )
                            .workspaceId(
                                    submission.getWorkspaceId()
                            )
                            .studentId(
                                    submission.getStudentId()
                            )
                            .teacherId(
                                    assignment.teacherId()
                            )
                            .assignmentTitle(
                                    assignment.title()
                            )
                            .submittedAt(
                                    submission.getSubmittedAt()
                            )
                            .build();

            notificationClient
                    .notifyAssignmentSubmitted(
                            request
                    );

            log.info(
                    "Assignment-submitted notification triggered for submission {}",
                    submission.getId()
            );

        } catch (Exception exception) {

            log.error(
                    "Submission saved, but teacher notification failed for submission {}",
                    submission.getId(),
                    exception
            );
        }
    }

    private void sendSubmissionGradedNotification(
            Submission submission,
            AssignmentResponse assignment) {

        try {

            SubmissionGradedNotificationRequest request =
                    SubmissionGradedNotificationRequest
                            .builder()
                            .submissionId(
                                    submission.getId()
                            )
                            .assignmentId(
                                    submission.getAssignmentId()
                            )
                            .workspaceId(
                                    submission.getWorkspaceId()
                            )
                            .studentId(
                                    submission.getStudentId()
                            )
                            .assignmentTitle(
                                    assignment.title()
                            )
                            .marksObtained(
                                    submission.getMarksObtained()
                            )
                            .maxMarks(
                                    assignment.maxMarks()
                            )
                            .feedback(
                                    submission.getFeedback()
                            )
                            .build();

            notificationClient
                    .notifySubmissionGraded(
                            request
                    );

            log.info(
                    "Submission-graded notification triggered for submission {}",
                    submission.getId()
            );

        } catch (Exception exception) {

            log.error(
                    "Submission was graded, but student notification failed for submission {}",
                    submission.getId(),
                    exception
            );
        }
    }

    private String normalizeText(
            String value) {

        if (value == null) {
            return null;
        }

        String trimmed =
                value.trim();

        return trimmed.isEmpty()
                ? null
                : trimmed;
    }

    private SubmissionResponse mapToResponse(
            Submission submission) {

        return SubmissionResponse
                .builder()
                .id(
                        submission.getId()
                )
                .assignmentId(
                        submission.getAssignmentId()
                )
                .workspaceId(
                        submission.getWorkspaceId()
                )
                .studentId(
                        submission.getStudentId()
                )
                .content(
                        submission.getContent()
                )
                .attachmentUrl(
                        submission.getAttachmentUrl()
                )
                .marksObtained(
                        submission.getMarksObtained()
                )
                .feedback(
                        submission.getFeedback()
                )
                .status(
                        submission.getStatus()
                )
                .submittedAt(
                        submission.getSubmittedAt()
                )
                .updatedAt(
                        submission.getUpdatedAt()
                )
                .build();
    }
}