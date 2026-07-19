package com.classhub.workspace.service.impl;
import com.classhub.workspace.exception.WorkspaceAccessDeniedException;
import com.classhub.workspace.exception.WorkspaceAlreadyJoinedException;
import com.classhub.workspace.exception.WorkspaceMemberNotFoundException;
import com.classhub.workspace.exception.WorkspaceNotFoundException;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.classhub.workspace.dto.CreateWorkspaceRequest;
import com.classhub.workspace.dto.JoinWorkspaceRequest;
import com.classhub.workspace.dto.UpdateWorkspaceRequest;
import com.classhub.workspace.dto.response.JoinWorkspaceResponse;
import com.classhub.workspace.dto.response.RegenerateJoinCodeResponse;
import com.classhub.workspace.dto.response.WorkspaceMemberResponse;
import com.classhub.workspace.dto.response.WorkspaceResponse;
import com.classhub.workspace.entity.Workspace;
import com.classhub.workspace.entity.WorkspaceMember;
import com.classhub.workspace.exception.InvalidJoinCodeException;
import com.classhub.workspace.exception.JoinCodeGenerationException;
import com.classhub.workspace.exception.WorkspaceAccessDeniedException;
import com.classhub.workspace.exception.WorkspaceNotFoundException;
import com.classhub.workspace.repository.WorkspaceMemberRepository;
import com.classhub.workspace.repository.WorkspaceRepository;
import com.classhub.workspace.service.WorkspaceService;
import com.classhub.workspace.util.JoinCodeGenerator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements WorkspaceService {

    private static final int MAX_JOIN_CODE_ATTEMPTS = 10;

    private final WorkspaceRepository workspaceRepository;
    private final JoinCodeGenerator joinCodeGenerator;
    private final WorkspaceMemberRepository workspaceMemberRepository;

    @Override
    @Transactional
    public WorkspaceResponse createWorkspace(
            CreateWorkspaceRequest request,
            UUID teacherId) {

        String joinCode = generateUniqueJoinCode();

        Workspace workspace = Workspace.builder()
                .name(request.getName().trim())
                .description(
                        request.getDescription() == null
                                ? null
                                : request.getDescription().trim())
                .subject(request.getSubject().trim())
                .joinCode(joinCode)
                .teacherId(teacherId)
                .active(true)
                .build();

        Workspace savedWorkspace =
                workspaceRepository.save(workspace);

        return mapToResponse(savedWorkspace);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkspaceResponse> getMyWorkspaces(
            UUID teacherId) {

        return workspaceRepository
                .findByTeacherIdAndActiveTrueOrderByCreatedAtDesc(
                        teacherId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public WorkspaceResponse getWorkspaceById(
            UUID workspaceId) {

        Workspace workspace = workspaceRepository
                .findById(workspaceId)
                .orElseThrow(() ->
                        new WorkspaceNotFoundException(
                                "Workspace not found with id: " + workspaceId));

        if (!workspace.isActive()) {
            throw new WorkspaceNotFoundException(
                    "Workspace not found with id: " + workspaceId);
        }

        return mapToResponse(workspace);
    }
    
    @Override
    @Transactional
    public WorkspaceResponse updateWorkspace(
            UUID workspaceId,
            UpdateWorkspaceRequest request,
            UUID teacherId) {

        Workspace workspace = workspaceRepository
                .findById(workspaceId)
                .orElseThrow(() ->
                        new WorkspaceNotFoundException(
                                "Workspace not found with id: " + workspaceId));

        if (!workspace.isActive()) {
            throw new WorkspaceNotFoundException(
                    "Workspace not found with id: " + workspaceId);
        }

        if (!workspace.getTeacherId().equals(teacherId)) {
            throw new WorkspaceAccessDeniedException(
                    "You are not allowed to update this workspace.");
        }

        workspace.setName(request.getName().trim());

        workspace.setDescription(
                request.getDescription() == null
                        ? null
                        : request.getDescription().trim());

        workspace.setSubject(request.getSubject().trim());

        Workspace updatedWorkspace =
                workspaceRepository.save(workspace);

        return mapToResponse(updatedWorkspace);
    }
    
    @Override
    @Transactional
    public void deleteWorkspace(
            UUID workspaceId,
            UUID teacherId) {

        Workspace workspace = workspaceRepository
                .findById(workspaceId)
                .orElseThrow(() ->
                        new WorkspaceNotFoundException(
                                "Workspace not found with id: " + workspaceId));

        if (!workspace.isActive()) {
            throw new WorkspaceNotFoundException(
                    "Workspace not found with id: " + workspaceId);
        }

        if (!workspace.getTeacherId().equals(teacherId)) {
            throw new WorkspaceAccessDeniedException(
                    "You are not allowed to delete this workspace.");
        }

        workspace.setActive(false);

        workspaceRepository.save(workspace);
    }
    
    @Override
    @Transactional
    public JoinWorkspaceResponse joinWorkspace(
            JoinWorkspaceRequest request,
            UUID studentId) {

        String normalizedJoinCode =
                request.getJoinCode()
                        .trim()
                        .toUpperCase();

        Workspace workspace = workspaceRepository
                .findByJoinCode(normalizedJoinCode)
                .orElseThrow(() ->
                        new InvalidJoinCodeException(
                                "Invalid workspace join code."));

        if (!workspace.isActive()) {
            throw new InvalidJoinCodeException(
                    "This workspace is no longer active.");
        }

        if (workspace.getTeacherId().equals(studentId)) {
            throw new WorkspaceAlreadyJoinedException(
                    "The workspace owner cannot join as a student.");
        }

        if (workspaceMemberRepository
                .existsByWorkspaceAndStudentId(
                        workspace,
                        studentId)) {

            throw new WorkspaceAlreadyJoinedException(
                    "You have already joined this workspace.");
        }

        WorkspaceMember workspaceMember =
                WorkspaceMember.builder()
                        .workspace(workspace)
                        .studentId(studentId)
                        .build();

        WorkspaceMember savedMember =
                workspaceMemberRepository.save(workspaceMember);

        return JoinWorkspaceResponse.builder()
                .message("Workspace joined successfully.")
                .membershipId(savedMember.getId())
                .workspaceId(workspace.getId())
                .workspaceName(workspace.getName())
                .subject(workspace.getSubject())
                .studentId(savedMember.getStudentId())
                .joinedAt(savedMember.getJoinedAt())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<WorkspaceResponse> getJoinedWorkspaces(
            UUID studentId) {

        List<WorkspaceMember> members =
                workspaceMemberRepository.findByStudentId(studentId);

        return members.stream()
                .map(WorkspaceMember::getWorkspace)
                .filter(Workspace::isActive)
                .map(this::mapToResponse)
                .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<WorkspaceMemberResponse> getWorkspaceMembers(
            UUID workspaceId,
            UUID teacherId) {

        Workspace workspace = workspaceRepository
                .findById(workspaceId)
                .orElseThrow(() ->
                        new WorkspaceNotFoundException(
                                "Workspace not found with id: " + workspaceId));

        if (!workspace.isActive()) {
            throw new WorkspaceNotFoundException(
                    "Workspace not found with id: " + workspaceId);
        }

        if (!workspace.getTeacherId().equals(teacherId)) {
            throw new WorkspaceAccessDeniedException(
                    "You are not allowed to view members of this workspace.");
        }

        return workspaceMemberRepository
                .findByWorkspaceOrderByJoinedAtAsc(workspace)
                .stream()
                .map(member ->
                        WorkspaceMemberResponse.builder()
                                .membershipId(member.getId())
                                .studentId(member.getStudentId())
                                .joinedAt(member.getJoinedAt())
                                .build())
                .toList();
    }
    
    @Override
    @Transactional
    public void removeStudent(
            UUID workspaceId,
            UUID studentId,
            UUID teacherId) {

        Workspace workspace = workspaceRepository
                .findById(workspaceId)
                .orElseThrow(() ->
                        new WorkspaceNotFoundException(
                                "Workspace not found with id: " + workspaceId));

        if (!workspace.isActive()) {
            throw new WorkspaceNotFoundException(
                    "Workspace not found with id: " + workspaceId);
        }

        if (!workspace.getTeacherId().equals(teacherId)) {
            throw new WorkspaceAccessDeniedException(
                    "You are not allowed to remove students from this workspace.");
        }

        WorkspaceMember member = workspaceMemberRepository
                .findByWorkspaceAndStudentId(
                        workspace,
                        studentId)
                .orElseThrow(() ->
                        new WorkspaceMemberNotFoundException(
                                "Student is not a member of this workspace."));

        workspaceMemberRepository.delete(member);
    }
    
    @Override
    @Transactional
    public RegenerateJoinCodeResponse regenerateJoinCode(
            UUID workspaceId,
            UUID teacherId) {

        Workspace workspace = workspaceRepository
                .findById(workspaceId)
                .orElseThrow(() ->
                        new WorkspaceNotFoundException(
                                "Workspace not found with id: " + workspaceId));

        if (!workspace.isActive()) {
            throw new WorkspaceNotFoundException(
                    "Workspace not found with id: " + workspaceId);
        }

        if (!workspace.getTeacherId().equals(teacherId)) {
            throw new WorkspaceAccessDeniedException(
                    "You are not allowed to regenerate the join code "
                            + "for this workspace.");
        }

        String oldJoinCode = workspace.getJoinCode();
        String newJoinCode = generateUniqueJoinCode();

        workspace.setJoinCode(newJoinCode);

        workspaceRepository.save(workspace);

        return RegenerateJoinCodeResponse.builder()
                .message("Join code regenerated successfully.")
                .workspaceId(workspace.getId())
                .oldJoinCode(oldJoinCode)
                .newJoinCode(newJoinCode)
                .build();
    }

    private String generateUniqueJoinCode() {

        for (int attempt = 0;
             attempt < MAX_JOIN_CODE_ATTEMPTS;
             attempt++) {

            String joinCode = joinCodeGenerator.generate();

            if (!workspaceRepository.existsByJoinCode(joinCode)) {
                return joinCode;
            }
        }

        throw new JoinCodeGenerationException(
                "Unable to generate a unique workspace join code.");
    }
    
    

    private WorkspaceResponse mapToResponse(
            Workspace workspace) {

        return WorkspaceResponse.builder()
                .id(workspace.getId())
                .name(workspace.getName())
                .description(workspace.getDescription())
                .subject(workspace.getSubject())
                .joinCode(workspace.getJoinCode())
                .teacherId(workspace.getTeacherId())
                .active(workspace.isActive())
                .createdAt(workspace.getCreatedAt())
                .updatedAt(workspace.getUpdatedAt())
                .build();
    }
}