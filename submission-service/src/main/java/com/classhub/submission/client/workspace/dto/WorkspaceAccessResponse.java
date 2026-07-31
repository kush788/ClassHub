package com.classhub.submission.client.workspace.dto;

import java.util.UUID;

public record WorkspaceAccessResponse(

        UUID workspaceId,

        String workspaceName,

        boolean active,

        boolean owner,

        boolean member,

        boolean canManage,

        boolean canView
) {
}