package com.classhub.resource.client;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.classhub.resource.client.config.FeignAuthConfig;
import com.classhub.resource.client.dto.WorkspaceAccessResponse;

@FeignClient(
        name = "workspace-service",
        configuration = FeignAuthConfig.class)
public interface WorkspaceClient {

    @GetMapping("/api/v1/workspaces/{workspaceId}/access")
    WorkspaceAccessResponse getWorkspaceAccess(
            @PathVariable("workspaceId")
            UUID workspaceId);
}