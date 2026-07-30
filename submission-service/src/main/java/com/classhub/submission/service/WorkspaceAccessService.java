package com.classhub.submission.service;

import java.util.UUID;

import com.classhub.submission.client.workspace.dto.WorkspaceAccessResponse;

public interface WorkspaceAccessService {

    WorkspaceAccessResponse getAccess(UUID workspaceId);

    void requireViewAccess(UUID workspaceId);

    void requireManageAccess(UUID workspaceId);

    void requireMemberAccess(UUID workspaceId);
}