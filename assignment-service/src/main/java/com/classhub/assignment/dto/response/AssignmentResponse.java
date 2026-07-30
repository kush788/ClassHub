package com.classhub.assignment.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AssignmentResponse {

    private UUID id;

    private UUID workspaceId;

    private UUID teacherId;

    private String title;

    private String description;

    private String instructions;

    private Integer maxMarks;

    private LocalDateTime dueDate;

    private boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}