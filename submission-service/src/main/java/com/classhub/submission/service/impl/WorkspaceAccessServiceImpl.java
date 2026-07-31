package com.classhub.submission.service.impl;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.classhub.submission.client.workspace.WorkspaceClient;
import com.classhub.submission.client.workspace.dto.WorkspaceAccessResponse;
import com.classhub.submission.exception.SubmissionAccessDeniedException;
import com.classhub.submission.exception.WorkspaceServiceUnavailableException;
import com.classhub.submission.service.WorkspaceAccessService;

import feign.FeignException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkspaceAccessServiceImpl
        implements WorkspaceAccessService {

    private final WorkspaceClient workspaceClient;

    @Override
    public WorkspaceAccessResponse getAccess(UUID workspaceId) {

        try {

            return workspaceClient.getWorkspaceAccess(workspaceId);

        } catch (FeignException.Forbidden exception) {

            throw new SubmissionAccessDeniedException(
                    "You do not have access to this workspace"
            );

        } catch (FeignException.NotFound exception) {

            throw new SubmissionAccessDeniedException(
                    "Workspace not found or inaccessible"
            );

        } catch (FeignException exception) {

            throw new WorkspaceServiceUnavailableException(
                    "Workspace Service is currently unavailable"
            );
        }
    }

    @Override
    public void requireViewAccess(UUID workspaceId) {

        WorkspaceAccessResponse access = getAccess(workspaceId);

        if (!access.active() || !access.canView()) {

            throw new SubmissionAccessDeniedException(
                    "You do not have permission to view this workspace"
            );
        }
    }

    @Override
    public void requireManageAccess(UUID workspaceId) {

        WorkspaceAccessResponse access = getAccess(workspaceId);

        if (!access.active() || !access.canManage()) {

            throw new SubmissionAccessDeniedException(
                    "Only the workspace owner can perform this operation"
            );
        }
    }

    @Override
    public void requireMemberAccess(UUID workspaceId) {

        WorkspaceAccessResponse access = getAccess(workspaceId);

        if (!access.active() || !access.member()) {

            throw new SubmissionAccessDeniedException(
                    "Only workspace members can submit assignments"
            );
        }
    }
}