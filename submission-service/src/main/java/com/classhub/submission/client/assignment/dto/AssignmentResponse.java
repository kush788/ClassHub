package com.classhub.submission.client.assignment.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record AssignmentResponse(

        UUID id,

        UUID workspaceId,

        UUID teacherId,

        String title,

        String description,

        String instructions,

        Integer maxMarks,

        LocalDateTime dueDate,

        boolean active,

        LocalDateTime createdAt,

        LocalDateTime updatedAt
) {
}