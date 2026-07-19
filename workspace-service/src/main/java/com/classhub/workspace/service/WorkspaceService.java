package com.classhub.workspace.service;

import java.util.List;
import java.util.UUID;

import com.classhub.workspace.dto.CreateWorkspaceRequest;
import com.classhub.workspace.dto.JoinWorkspaceRequest;
import com.classhub.workspace.dto.UpdateWorkspaceRequest;
import com.classhub.workspace.dto.response.JoinWorkspaceResponse;
import com.classhub.workspace.dto.response.RegenerateJoinCodeResponse;
import com.classhub.workspace.dto.response.WorkspaceMemberResponse;
import com.classhub.workspace.dto.response.WorkspaceResponse;

public interface WorkspaceService {

    WorkspaceResponse createWorkspace(
            CreateWorkspaceRequest request,
            UUID teacherId);

    List<WorkspaceResponse> getMyWorkspaces(
            UUID teacherId);

    WorkspaceResponse getWorkspaceById(
            UUID workspaceId);

    WorkspaceResponse updateWorkspace(
            UUID workspaceId,
            UpdateWorkspaceRequest request,
            UUID teacherId);

    void deleteWorkspace(
            UUID workspaceId,
            UUID teacherId);
    
    JoinWorkspaceResponse joinWorkspace(
            JoinWorkspaceRequest request,
            UUID studentId);
    
    List<WorkspaceResponse> getJoinedWorkspaces(
            UUID studentId);
    
    List<WorkspaceMemberResponse> getWorkspaceMembers(
            UUID workspaceId,
            UUID teacherId);
    
    void removeStudent(
            UUID workspaceId,
            UUID studentId,
            UUID teacherId);
    
    RegenerateJoinCodeResponse regenerateJoinCode(
            UUID workspaceId,
            UUID teacherId);
}