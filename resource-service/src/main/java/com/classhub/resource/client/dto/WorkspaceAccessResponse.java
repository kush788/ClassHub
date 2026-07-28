package com.classhub.resource.client.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceAccessResponse {

    private UUID workspaceId;

    private String workspaceName;

    private boolean active;

    private boolean owner;

    private boolean member;

    private boolean canManage;

    private boolean canView;
}