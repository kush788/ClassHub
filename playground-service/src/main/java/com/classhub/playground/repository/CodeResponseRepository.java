package com.classhub.playground.repository;

import com.classhub.playground.entity.CodeResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CodeResponseRepository
        extends JpaRepository<CodeResponse, UUID> {

    Optional<CodeResponse> findByQuestionIdAndStudentId(
            UUID questionId,
            UUID studentId
    );

    List<CodeResponse> findByStudentIdOrderByUpdatedAtDesc(
            UUID studentId
    );

    List<CodeResponse> findByQuestionIdOrderByUpdatedAtDesc(
            UUID questionId
    );

    List<CodeResponse> findByWorkspaceIdAndStudentIdOrderByUpdatedAtDesc(
            UUID workspaceId,
            UUID studentId
    );

    boolean existsByQuestionIdAndStudentId(
            UUID questionId,
            UUID studentId
    );

    void deleteByQuestionId(UUID questionId);
}