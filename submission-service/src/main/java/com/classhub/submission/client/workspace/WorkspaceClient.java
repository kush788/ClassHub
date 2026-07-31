package com.classhub.submission.client.workspace;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.classhub.submission.client.workspace.dto.WorkspaceAccessResponse;
import com.classhub.submission.config.FeignAuthConfig;

@FeignClient(
        name = "WORKSPACE-SERVICE",
        configuration = FeignAuthConfig.class
)
public interface WorkspaceClient {

    @GetMapping("/api/v1/workspaces/{workspaceId}/access")
    WorkspaceAccessResponse getWorkspaceAccess(
            @PathVariable UUID workspaceId
    );
}