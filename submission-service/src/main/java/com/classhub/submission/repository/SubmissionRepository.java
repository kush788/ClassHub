package com.classhub.submission.repository;
import com.classhub.submission.enums.SubmissionStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classhub.submission.entity.Submission;

public interface SubmissionRepository
        extends JpaRepository<Submission, UUID> {

    Optional<Submission> findByIdAndActiveTrue(UUID id);

    Optional<Submission>
    findByAssignmentIdAndStudentIdAndActiveTrue(
            UUID assignmentId,
            UUID studentId
    );

    List<Submission>
    findByStudentIdAndActiveTrueOrderBySubmittedAtDesc(
            UUID studentId
    );

    List<Submission>
    findByAssignmentIdAndActiveTrueOrderBySubmittedAtDesc(
            UUID assignmentId
    );

    boolean existsByAssignmentIdAndStudentIdAndActiveTrue(
            UUID assignmentId,
            UUID studentId
    );
    
    List<Submission> findByWorkspaceIdAndStatusAndActiveTrue(
            UUID workspaceId,
            SubmissionStatus status);
}