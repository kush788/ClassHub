package com.classhub.resource.service.impl;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.classhub.resource.client.WorkspaceClient;
import com.classhub.resource.client.dto.WorkspaceAccessResponse;
import com.classhub.resource.exception.ResourceAccessDeniedException;
import com.classhub.resource.exception.WorkspaceNotFoundForResourceException;
import com.classhub.resource.exception.WorkspaceServiceUnavailableException;
import com.classhub.resource.service.WorkspaceAccessService;

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
                    .getWorkspaceAccess(workspaceId);

        } catch (FeignException.NotFound exception) {

            throw new WorkspaceNotFoundForResourceException(
                    "Workspace not found.");

        } catch (FeignException.Unauthorized exception) {

            throw new ResourceAccessDeniedException(
                    "Workspace authentication failed.");

        } catch (FeignException.Forbidden exception) {

            throw new ResourceAccessDeniedException(
                    "Workspace access was denied.");

        } catch (FeignException exception) {

            throw new WorkspaceServiceUnavailableException(
                    "Workspace Service could not process the request.",
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

            throw new ResourceAccessDeniedException(
                    "You are not allowed to manage resources "
                            + "in this workspace.");
        }
    }

    @Override
    public void requireViewAccess(
            UUID workspaceId) {

        WorkspaceAccessResponse access =
                getAccess(workspaceId);

        if (!access.isActive()
                || !access.isCanView()) {

            throw new ResourceAccessDeniedException(
                    "You are not allowed to view resources "
                            + "in this workspace.");
        }
    }
}