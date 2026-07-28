package com.classhub.resource.controller;
import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.classhub.resource.dto.UpdateResourceRequest;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.classhub.resource.dto.UploadResourceRequest;
import com.classhub.resource.dto.response.MessageResponse;
import com.classhub.resource.dto.response.ResourceResponse;
import com.classhub.resource.exception.ResourceAccessDeniedException;
import com.classhub.resource.security.AuthenticatedUser;
import com.classhub.resource.service.ResourceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResourceResponse> uploadResource(
            @Valid @ModelAttribute
            UploadResourceRequest request,

            @RequestParam("file")
            MultipartFile file,

            @AuthenticationPrincipal
            AuthenticatedUser user) {

        if (user == null
                || !"TEACHER".equalsIgnoreCase(user.role())) {

            throw new ResourceAccessDeniedException(
                    "Only teachers can upload resources.");
        }

        ResourceResponse response =
                resourceService.uploadResource(
                        request,
                        file,
                        user.userId());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    
    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<ResourceResponse>>
            getResourcesByWorkspace(

            @PathVariable UUID workspaceId,

            @AuthenticationPrincipal
            AuthenticatedUser user) {

        if (user == null) {
            throw new ResourceAccessDeniedException(
                    "Authentication is required.");
        }

        if (!"TEACHER".equalsIgnoreCase(user.role())
                && !"STUDENT".equalsIgnoreCase(user.role())) {

            throw new ResourceAccessDeniedException(
                    "You are not allowed to view resources.");
        }

        return ResponseEntity.ok(
                resourceService.getResourcesByWorkspace(
                        workspaceId));
    }
    
    @GetMapping("/{resourceId}")
    public ResponseEntity<ResourceResponse> getResourceById(

            @PathVariable UUID resourceId,

            @AuthenticationPrincipal
            AuthenticatedUser user) {

        if (user == null) {
            throw new ResourceAccessDeniedException(
                    "Authentication is required.");
        }

        return ResponseEntity.ok(
                resourceService.getResourceById(resourceId));
    }
    
    @DeleteMapping("/{resourceId}")
    public ResponseEntity<MessageResponse> deleteResource(
            @PathVariable UUID resourceId,
            @AuthenticationPrincipal AuthenticatedUser user) {

        if (user == null
                || !"TEACHER".equalsIgnoreCase(user.role())) {

            throw new ResourceAccessDeniedException(
                    "Only teachers can delete resources.");
        }

        MessageResponse response =
                resourceService.deleteResource(
                        resourceId,
                        user.userId());

        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{resourceId}")
    public ResponseEntity<ResourceResponse> updateResource(
            @PathVariable UUID resourceId,

            @Valid
            @RequestBody
            UpdateResourceRequest request,

            @AuthenticationPrincipal
            AuthenticatedUser user) {

        if (user == null
                || !"TEACHER".equalsIgnoreCase(user.role())) {

            throw new ResourceAccessDeniedException(
                    "Only teachers can update resources.");
        }

        return ResponseEntity.ok(
                resourceService.updateResource(
                        resourceId,
                        request,
                        user.userId()));
    }
}