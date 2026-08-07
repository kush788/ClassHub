package com.classhub.playground.entity;

import com.classhub.playground.enums.ExecutionStatus;
import com.classhub.playground.enums.ProgrammingLanguage;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "code_responses",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_question_student",
            columnNames = {"question_id", "student_id"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "question_id", nullable = false)
    private UUID questionId;

    @Column(name = "workspace_id", nullable = false)
    private UUID workspaceId;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProgrammingLanguage language;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String sourceCode;

    @Column(columnDefinition = "TEXT")
    private String standardInput;

    @Column(columnDefinition = "TEXT")
    private String output;

    @Column(columnDefinition = "TEXT")
    private String compileError;

    @Column(columnDefinition = "TEXT")
    private String runtimeError;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExecutionStatus executionStatus;

    private Long executionTimeMs;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}