package com.classhub.workspace.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.classhub.workspace.dto.CreateWorkspaceRequest;
import com.classhub.workspace.dto.JoinWorkspaceRequest;
import com.classhub.workspace.dto.UpdateWorkspaceRequest;
import com.classhub.workspace.dto.response.JoinWorkspaceResponse;
import com.classhub.workspace.dto.response.RegenerateJoinCodeResponse;
import com.classhub.workspace.dto.response.WorkspaceMemberResponse;
import com.classhub.workspace.dto.response.WorkspaceResponse;
import com.classhub.workspace.exception.WorkspaceAccessDeniedException;
import com.classhub.workspace.security.AuthenticatedUser;
import com.classhub.workspace.service.WorkspaceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @PostMapping
    public ResponseEntity<WorkspaceResponse> createWorkspace(
            @Valid @RequestBody CreateWorkspaceRequest request,
            @AuthenticationPrincipal AuthenticatedUser user) {

        requireRole(user, "TEACHER");

        WorkspaceResponse response =
                workspaceService.createWorkspace(
                        request,
                        user.userId());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<WorkspaceResponse>> getMyWorkspaces(
            @AuthenticationPrincipal AuthenticatedUser user) {

        requireRole(user, "TEACHER");

        return ResponseEntity.ok(
                workspaceService.getMyWorkspaces(
                        user.userId()));
    }

    @GetMapping("/joined")
    public ResponseEntity<List<WorkspaceResponse>> getJoinedWorkspaces(
            @AuthenticationPrincipal AuthenticatedUser user) {

        requireRole(user, "STUDENT");

        return ResponseEntity.ok(
                workspaceService.getJoinedWorkspaces(
                        user.userId()));
    }

    @PostMapping("/join")
    public ResponseEntity<JoinWorkspaceResponse> joinWorkspace(
            @Valid @RequestBody JoinWorkspaceRequest request,
            @AuthenticationPrincipal AuthenticatedUser user) {

        requireRole(user, "STUDENT");

        JoinWorkspaceResponse response =
                workspaceService.joinWorkspace(
                        request,
                        user.userId());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{workspaceId}")
    public ResponseEntity<WorkspaceResponse> getWorkspaceById(
            @PathVariable UUID workspaceId,
            @AuthenticationPrincipal AuthenticatedUser user) {

        requireAnyRole(user, "TEACHER", "STUDENT");

        return ResponseEntity.ok(
                workspaceService.getWorkspaceById(
                        workspaceId));
    }

    @PutMapping("/{workspaceId}")
    public ResponseEntity<WorkspaceResponse> updateWorkspace(
            @PathVariable UUID workspaceId,
            @Valid @RequestBody UpdateWorkspaceRequest request,
            @AuthenticationPrincipal AuthenticatedUser user) {

        requireRole(user, "TEACHER");

        return ResponseEntity.ok(
                workspaceService.updateWorkspace(
                        workspaceId,
                        request,
                        user.userId()));
    }

    @DeleteMapping("/{workspaceId}")
    public ResponseEntity<Void> deleteWorkspace(
            @PathVariable UUID workspaceId,
            @AuthenticationPrincipal AuthenticatedUser user) {

        requireRole(user, "TEACHER");

        workspaceService.deleteWorkspace(
                workspaceId,
                user.userId());

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{workspaceId}/members")
    public ResponseEntity<List<WorkspaceMemberResponse>>
            getWorkspaceMembers(
                    @PathVariable UUID workspaceId,
                    @AuthenticationPrincipal AuthenticatedUser user) {

        requireRole(user, "TEACHER");

        return ResponseEntity.ok(
                workspaceService.getWorkspaceMembers(
                        workspaceId,
                        user.userId()));
    }

    @DeleteMapping("/{workspaceId}/members/{studentId}")
    public ResponseEntity<Void> removeStudent(
            @PathVariable UUID workspaceId,
            @PathVariable UUID studentId,
            @AuthenticationPrincipal AuthenticatedUser user) {

        requireRole(user, "TEACHER");

        workspaceService.removeStudent(
                workspaceId,
                studentId,
                user.userId());

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{workspaceId}/regenerate-code")
    public ResponseEntity<RegenerateJoinCodeResponse>
            regenerateJoinCode(
                    @PathVariable UUID workspaceId,
                    @AuthenticationPrincipal AuthenticatedUser user) {

        requireRole(user, "TEACHER");

        return ResponseEntity.ok(
                workspaceService.regenerateJoinCode(
                        workspaceId,
                        user.userId()));
    }

    private void requireRole(
            AuthenticatedUser user,
            String requiredRole) {

        if (user == null
                || !requiredRole.equalsIgnoreCase(user.role())) {

            throw new WorkspaceAccessDeniedException(
                    "You are not allowed to perform this action.");
        }
    }

    private void requireAnyRole(
            AuthenticatedUser user,
            String... allowedRoles) {

        if (user == null) {
            throw new WorkspaceAccessDeniedException(
                    "You are not allowed to perform this action.");
        }

        for (String allowedRole : allowedRoles) {
            if (allowedRole.equalsIgnoreCase(user.role())) {
                return;
            }
        }

        throw new WorkspaceAccessDeniedException(
                "You are not allowed to perform this action.");
    }
}