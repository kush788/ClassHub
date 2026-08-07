package com.classhub.playground.client;

import com.classhub.playground.client.config.FeignAuthConfig;
import com.classhub.playground.client.dto.WorkspaceAccessResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(
        name = "workspace-service",
        configuration = FeignAuthConfig.class
)
public interface WorkspaceClient {

    @GetMapping("/api/v1/workspaces/{workspaceId}/access")
    WorkspaceAccessResponse getWorkspaceAccess(
            @PathVariable("workspaceId") UUID workspaceId
    );
}