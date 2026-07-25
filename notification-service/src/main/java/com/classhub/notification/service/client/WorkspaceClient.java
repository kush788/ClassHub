package com.classhub.notification.service.client;

import java.util.List;
import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.classhub.notification.dto.internal.InternalWorkspaceMemberResponse;

@FeignClient(name = "workspace-service")
public interface WorkspaceClient {

    @GetMapping("/api/v1/workspaces/internal/{workspaceId}/members")
    List<InternalWorkspaceMemberResponse> getWorkspaceMembers(
            @PathVariable UUID workspaceId);

}