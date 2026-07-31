package com.classhub.submission.client.assignment;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.classhub.submission.client.assignment.dto.AssignmentResponse;
import com.classhub.submission.config.FeignAuthConfig;

@FeignClient(
        name = "ASSIGNMENT-SERVICE",
        configuration = FeignAuthConfig.class
)
public interface AssignmentClient {

    @GetMapping("/api/v1/assignments/{assignmentId}")
    AssignmentResponse getAssignmentById(
            @PathVariable UUID assignmentId
    );
}