package com.classhub.assignment.service.impl;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.classhub.assignment.client.WorkspaceClient;
import com.classhub.assignment.client.dto.WorkspaceAccessResponse;
import com.classhub.assignment.exception.AssignmentAccessDeniedException;
import com.classhub.assignment.exception.WorkspaceNotFoundForAssignmentException;
import com.classhub.assignment.exception.WorkspaceServiceUnavailableException;
import com.classhub.assignment.service.WorkspaceAccessService;

import feign.FeignException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkspaceAccessServiceImpl
        implements WorkspaceAccessService {

    private final WorkspaceClient workspaceClient;

    @Override
    public WorkspaceAccessResponse getAccess(
            UUID workspaceId) {

        try {

            return workspaceClient
                    .getWorkspaceAccess(
                            workspaceId);

        } catch (FeignException.NotFound exception) {

            throw new WorkspaceNotFoundForAssignmentException(
                    "Workspace not found.");

        } catch (FeignException.Unauthorized exception) {

            throw new AssignmentAccessDeniedException(
                    "Workspace authentication failed.");

        } catch (FeignException.Forbidden exception) {

            throw new AssignmentAccessDeniedException(
                    "Workspace access was denied.");

        } catch (FeignException exception) {

            throw new WorkspaceServiceUnavailableException(
                    "Workspace Service could not process "
                            + "the request.",
                    exception);
        }
    }

    @Override
    public void requireManageAccess(
            UUID workspaceId) {

        WorkspaceAccessResponse access =
                getAccess(workspaceId);

        if (!access.isActive()
                || !access.isCanManage()) {

            throw new AssignmentAccessDeniedException(
                    "You are not allowed to manage "
                            + "assignments in this workspace.");
        }
    }

    @Override
    public void requireViewAccess(
            UUID workspaceId) {

        WorkspaceAccessResponse access =
                getAccess(workspaceId);

        if (!access.isActive()
                || !access.isCanView()) {

            throw new AssignmentAccessDeniedException(
                    "You are not allowed to view "
                            + "assignments in this workspace.");
        }
    }
}