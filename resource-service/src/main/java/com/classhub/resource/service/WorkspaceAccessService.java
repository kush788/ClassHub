package com.classhub.resource.service;

import java.util.UUID;

import com.classhub.resource.client.dto.WorkspaceAccessResponse;

public interface WorkspaceAccessService {

    WorkspaceAccessResponse getAccess(
            UUID workspaceId);

    void requireManageAccess(
            UUID workspaceId);

    void requireViewAccess(
            UUID workspaceId);
}