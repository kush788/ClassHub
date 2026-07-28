package com.classhub.leaderboard.client;

import java.util.List;
import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.classhub.leaderboard.config.FeignAuthConfig;
import com.classhub.leaderboard.dto.WorkspaceMemberData;

@FeignClient(
        name = "workspace-service",
        configuration = FeignAuthConfig.class
)
public interface WorkspaceClient {

    @GetMapping(
            "/api/v1/workspaces/internal/{workspaceId}/members"
    )
    List<WorkspaceMemberData> getWorkspaceMembers(
            @PathVariable UUID workspaceId
    );
}