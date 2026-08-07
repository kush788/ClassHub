package com.classhub.playground.repository;

import com.classhub.playground.entity.CodingQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CodingQuestionRepository
        extends JpaRepository<CodingQuestion, UUID> {

    List<CodingQuestion> findByWorkspaceIdOrderByCreatedAtDesc(
            UUID workspaceId
    );

    List<CodingQuestion> findByWorkspaceIdAndActiveTrueOrderByCreatedAtDesc(
            UUID workspaceId
    );

    List<CodingQuestion> findByTeacherIdOrderByCreatedAtDesc(
            UUID teacherId
    );

    Optional<CodingQuestion> findByIdAndTeacherId(
            UUID id,
            UUID teacherId
    );

    boolean existsByIdAndWorkspaceId(
            UUID id,
            UUID workspaceId
    );
}