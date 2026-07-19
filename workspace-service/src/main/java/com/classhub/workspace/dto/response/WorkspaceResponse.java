package com.classhub.workspace.dto.response;

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
public class WorkspaceResponse {

    private UUID id;

    private String name;

    private String description;

    private String subject;

    private String joinCode;

    private UUID teacherId;

    private boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}