package com.classhub.assignment.service;

import java.util.UUID;

import com.classhub.assignment.client.dto.WorkspaceAccessResponse;

public interface WorkspaceAccessService {

    WorkspaceAccessResponse getAccess(
            UUID workspaceId);

    void requireManageAccess(
            UUID workspaceId);

    void requireViewAccess(
            UUID workspaceId);
}