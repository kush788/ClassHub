package com.classhub.resource.service;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.classhub.resource.dto.UpdateResourceRequest;
import com.classhub.resource.dto.UploadResourceRequest;
import com.classhub.resource.dto.response.MessageResponse;
import com.classhub.resource.dto.response.ResourceResponse;

public interface ResourceService {

    ResourceResponse uploadResource(
            UploadResourceRequest request,
            MultipartFile file,
            UUID uploadedBy);

    List<ResourceResponse> getResourcesByWorkspace(
            UUID workspaceId);

    ResourceResponse getResourceById(
            UUID resourceId);

    MessageResponse deleteResource(
            UUID resourceId,
            UUID userId);
    
    ResourceResponse updateResource(
            UUID resourceId,
            UpdateResourceRequest request,
            UUID userId);
}