package com.classhub.assignment.dto.internal;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentNotificationRequest {

    private UUID workspaceId;

    private UUID teacherId;

    private String assignmentTitle;

    private LocalDateTime dueDate;
}