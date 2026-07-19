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
public class JoinWorkspaceResponse {

    private String message;

    private UUID membershipId;

    private UUID workspaceId;

    private String workspaceName;

    private String subject;

    private UUID studentId;

    private LocalDateTime joinedAt;
}