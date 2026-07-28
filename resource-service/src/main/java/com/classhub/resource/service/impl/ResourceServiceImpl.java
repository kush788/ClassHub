package com.classhub.resource.service.impl;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.classhub.resource.client.NotificationClient;
import com.classhub.resource.cloudinary.CloudinaryService;
import com.classhub.resource.dto.UpdateResourceRequest;
import com.classhub.resource.dto.UploadResourceRequest;
import com.classhub.resource.dto.internal.ResourceNotificationRequest;
import com.classhub.resource.dto.response.MessageResponse;
import com.classhub.resource.dto.response.ResourceResponse;
import com.classhub.resource.entity.Resource;
import com.classhub.resource.entity.ResourceType;
import com.classhub.resource.exception.CloudinaryOperationException;
import com.classhub.resource.exception.ResourceAccessDeniedException;
import com.classhub.resource.exception.ResourceNotFoundException;
import com.classhub.resource.repository.ResourceRepository;
import com.classhub.resource.service.ResourceService;
import com.classhub.resource.service.WorkspaceAccessService;
import com.classhub.resource.util.ResourceFileUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResourceServiceImpl
        implements ResourceService {

    private final ResourceRepository resourceRepository;
    private final CloudinaryService cloudinaryService;
    private final WorkspaceAccessService workspaceAccessService;
    private final NotificationClient notificationClient;

    @Override
    @Transactional
    public ResourceResponse uploadResource(
            UploadResourceRequest request,
            MultipartFile file,
            UUID uploadedBy) {

        /*
         * Verify that the authenticated teacher owns
         * and can manage the target workspace.
         */
        workspaceAccessService.requireManageAccess(
                request.getWorkspaceId());

        ResourceFileUtil.validateFile(file);

        ResourceType resourceType =
                ResourceFileUtil.detectResourceType(file);

        String requestedCloudinaryResourceType =
                ResourceFileUtil
                        .determineCloudinaryResourceType(file);

        Map<String, Object> uploadResult =
                cloudinaryService.uploadFile(
                        file,
                        requestedCloudinaryResourceType);

        String fileUrl =
                getRequiredString(
                        uploadResult,
                        "secure_url");

        String publicId =
                getRequiredString(
                        uploadResult,
                        "public_id");

        String cloudinaryResourceType =
                getRequiredString(
                        uploadResult,
                        "resource_type");

        Resource resource = Resource.builder()
                .workspaceId(request.getWorkspaceId())
                .uploadedBy(uploadedBy)
                .title(request.getTitle().trim())
                .description(
                        normalizeDescription(
                                request.getDescription()))
                .resourceType(resourceType)
                .fileUrl(fileUrl)
                .publicId(publicId)
                .cloudinaryResourceType(
                        cloudinaryResourceType)
                .originalFileName(
                        file.getOriginalFilename())
                .contentType(file.getContentType())
                .fileSize(file.getSize())
                .active(true)
                .build();

        try {

            Resource savedResource =
                    resourceRepository.save(resource);

            /*
             * Step 9:
             * Trigger Notification Service after
             * the resource has been saved successfully.
             */
            sendResourceUploadedNotification(
                    savedResource);

            return mapToResponse(savedResource);

        } catch (RuntimeException exception) {

            /*
             * If Cloudinary upload succeeds but the
             * database save fails, remove the orphaned
             * asset from Cloudinary.
             */
            try {

                cloudinaryService.deleteFile(
                        publicId,
                        cloudinaryResourceType);

            } catch (RuntimeException cleanupException) {

                exception.addSuppressed(
                        cleanupException);
            }

            throw exception;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceResponse> getResourcesByWorkspace(
            UUID workspaceId) {

        workspaceAccessService.requireViewAccess(
                workspaceId);

        return resourceRepository
                .findByWorkspaceIdAndActiveTrueOrderByCreatedAtDesc(
                        workspaceId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ResourceResponse getResourceById(
            UUID resourceId) {

        Resource resource = resourceRepository
                .findByIdAndActiveTrue(resourceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Resource not found."));

        workspaceAccessService.requireViewAccess(
                resource.getWorkspaceId());

        return mapToResponse(resource);
    }

    @Override
    @Transactional
    public ResourceResponse updateResource(
            UUID resourceId,
            UpdateResourceRequest request,
            UUID userId) {

        Resource resource = resourceRepository
                .findByIdAndActiveTrue(resourceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Resource not found."));

        workspaceAccessService.requireManageAccess(
                resource.getWorkspaceId());

        if (!resource.getUploadedBy().equals(userId)) {

            throw new ResourceAccessDeniedException(
                    "You cannot update this resource.");
        }

        resource.setTitle(
                request.getTitle().trim());

        resource.setDescription(
                normalizeDescription(
                        request.getDescription()));

        Resource updatedResource =
                resourceRepository.save(resource);

        return mapToResponse(updatedResource);
    }

    @Override
    @Transactional
    public MessageResponse deleteResource(
            UUID resourceId,
            UUID userId) {

        Resource resource = resourceRepository
                .findByIdAndActiveTrue(resourceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Resource not found."));

        workspaceAccessService.requireManageAccess(
                resource.getWorkspaceId());

        if (!resource.getUploadedBy().equals(userId)) {

            throw new ResourceAccessDeniedException(
                    "You cannot delete this resource.");
        }

        cloudinaryService.deleteFile(
                resource.getPublicId(),
                resource.getCloudinaryResourceType());

        resource.setActive(false);

        resourceRepository.save(resource);

        return new MessageResponse(
                "Resource deleted successfully.");
    }

    private String getRequiredString(
            Map<String, Object> uploadResult,
            String key) {

        Object value = uploadResult.get(key);

        if (value == null
                || value.toString().isBlank()) {

            throw new CloudinaryOperationException(
                    "Cloudinary response does not contain '"
                            + key + "'.",
                    null);
        }

        return value.toString();
    }

    private String normalizeDescription(
            String description) {

        if (description == null
                || description.isBlank()) {

            return null;
        }

        return description.trim();
    }

    /*
     * Step 10:
     * Build the notification request and call
     * Notification Service through OpenFeign.
     */
    private void sendResourceUploadedNotification(
            Resource resource) {

        ResourceNotificationRequest notificationRequest =
                ResourceNotificationRequest.builder()
                        .workspaceId(
                                resource.getWorkspaceId())
                        .uploadedBy(
                                resource.getUploadedBy())
                        .resourceTitle(
                                resource.getTitle())
                        .resourceType(
                                resource.getResourceType().name())
                        .originalFileName(
                                resource.getOriginalFileName())
                        .build();

        try {

            notificationClient.notifyResourceUploaded(
                    notificationRequest);

            log.info(
                    "Resource-uploaded notification triggered for resource {}",
                    resource.getId());

        } catch (Exception exception) {

            /*
             * Resource upload remains successful even if
             * Notification Service or Gmail is unavailable.
             */
            log.error(
                    "Resource {} was uploaded, but notification delivery failed.",
                    resource.getId(),
                    exception);
        }
    }

    private ResourceResponse mapToResponse(
            Resource resource) {

        return ResourceResponse.builder()
                .id(resource.getId())
                .workspaceId(
                        resource.getWorkspaceId())
                .uploadedBy(
                        resource.getUploadedBy())
                .title(
                        resource.getTitle())
                .description(
                        resource.getDescription())
                .resourceType(
                        resource.getResourceType())
                .fileUrl(
                        resource.getFileUrl())
                .originalFileName(
                        resource.getOriginalFileName())
                .contentType(
                        resource.getContentType())
                .fileSize(
                        resource.getFileSize())
                .active(
                        resource.isActive())
                .createdAt(
                        resource.getCreatedAt())
                .updatedAt(
                        resource.getUpdatedAt())
                .build();
    }
}