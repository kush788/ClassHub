package com.classhub.leaderboard.client;

import java.util.List;
import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.classhub.leaderboard.config.FeignAuthConfig;
import com.classhub.leaderboard.dto.GradedSubmissionData;

@FeignClient(
        name = "submission-service",
        configuration = FeignAuthConfig.class
)
public interface SubmissionClient {

    @GetMapping(
            "/api/v1/submissions/internal/workspace/{workspaceId}/graded"
    )
    List<GradedSubmissionData> getGradedSubmissionsByWorkspace(
            @PathVariable UUID workspaceId
    );
}